import sharp from "sharp";

interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

export const compressImage = async (
  buffer: Buffer,
  options: CompressImageOptions = {}
): Promise<Buffer> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 80,
    format = "jpeg",
  } = options;

  try {
    let sharpInstance = sharp(buffer);

    // IMPORTANT: Rotate based on EXIF orientation first, then remove EXIF data
    sharpInstance = sharpInstance.rotate();

    // Get original image metadata after rotation
    const metadata = await sharpInstance.metadata();

    // Calculate new dimensions while maintaining aspect ratio
    let newWidth = metadata.width;
    let newHeight = metadata.height;

    if (newWidth && newHeight) {
      if (newWidth > maxWidth || newHeight > maxHeight) {
        const aspectRatio = newWidth / newHeight;

        if (aspectRatio > 1) {
          // Landscape
          newWidth = Math.min(newWidth, maxWidth);
          newHeight = Math.round(newWidth / aspectRatio);
        } else {
          // Portrait or square
          newHeight = Math.min(newHeight, maxHeight);
          newWidth = Math.round(newHeight * aspectRatio);
        }
      }
    }

    // Apply transformations
    sharpInstance = sharpInstance.resize(newWidth, newHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });

    // Apply format-specific compression and remove metadata
    switch (format) {
      case "jpeg":
        sharpInstance = sharpInstance
          .jpeg({
            quality,
            progressive: true,
            mozjpeg: true,
          })
          .withMetadata(false); // Remove EXIF data to prevent rotation
        break;
      case "png":
        sharpInstance = sharpInstance
          .png({
            quality,
            compressionLevel: 8,
            progressive: true,
          })
          .withMetadata(false);
        break;
      case "webp":
        sharpInstance = sharpInstance
          .webp({
            quality,
            effort: 6,
          })
          .withMetadata(false);
        break;
    }

    const compressedBuffer = await sharpInstance.toBuffer();

    console.log(
      `Image compressed: ${buffer.length} bytes -> ${compressedBuffer.length} bytes`
    );

    return compressedBuffer;
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error("Failed to compress image");
  }
};

export const getImageDimensions = async (
  buffer: Buffer
): Promise<{ width: number; height: number }> => {
  try {
    // Rotate based on EXIF first to get correct dimensions
    const metadata = await sharp(buffer).rotate().metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    return { width: 0, height: 0 };
  }
};

export const validateImageFile = (file: Express.Multer.File): boolean => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(
      "Invalid file type. Please upload JPEG, PNG, or WebP images."
    );
  }

  if (file.size > maxFileSize) {
    throw new Error("File too large. Please upload images smaller than 10MB.");
  }

  return true;
};
