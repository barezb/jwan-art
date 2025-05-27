import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { deleteFromS3 } from "../../lib/s3";
import { ApiResponse } from "../../types";

interface DeleteImageRequest {
  imageKey: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "DELETE") {
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

    const { imageKey }: DeleteImageRequest = req.body;

    if (!imageKey) {
      return res.status(400).json({
        success: false,
        error: "Image key is required",
      });
    }

    // Delete from S3
    await deleteFromS3(imageKey);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    });
  }
}