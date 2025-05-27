import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import multer from "multer";
import { compressImage, validateImageFile } from "../../lib/imageUtils";
import { uploadToS3, generateS3Key } from "../../lib/s3";
import { ApiResponse, UploadImageResponse } from "../../types";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Disable default body parser for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};

interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UploadImageResponse>>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Run multer middleware
    await runMiddleware(req, res, upload.single("image"));

    const multerReq = req as MulterRequest;
    const file = multerReq.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Validate file
    validateImageFile(file);

    // Compress image
    const compressedBuffer = await compressImage(file.buffer, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 80,
      format: "jpeg",
    });

    // Generate S3 key
    const s3Key = generateS3Key(file.originalname);

    // Upload to S3
    const imageUrl = await uploadToS3(compressedBuffer, s3Key, "image/jpeg");

    return res.status(200).json({
      success: true,
      data: {
        imageUrl,
        imageKey: s3Key,
      },
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
}