import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { deleteFromS3 } from "../../../lib/s3";
import {
  ApiResponse,
  CreateArtworkData,
  UpdateArtworkData,
} from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  try {
    switch (req.method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      case "PUT":
        return await handlePut(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: "Method not allowed",
        });
    }
  } catch (error) {
    console.error("Artworks API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const {
    page = "1",
    limit = "10",
    categoryId,
    featured,
    published,
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (categoryId && categoryId !== "all") {
    where.categoryId = categoryId as string;
  }

  if (featured === "true") {
    where.isFeatured = true;
  }

  if (published === "true") {
    where.isPublished = true;
  } else if (published === "false") {
    where.isPublished = false;
  }

  const [artworks, total] = await Promise.all([
    prisma.artwork.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNum,
    }),
    prisma.artwork.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      artworks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const data: CreateArtworkData & { imageUrl: string; imageKey: string } =
    req.body;

  if (!data.title || !data.categoryId || !data.imageUrl || !data.imageKey) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    return res.status(400).json({
      success: false,
      error: "Category not found",
    });
  }

  const artwork = await prisma.artwork.create({
    data: {
      title: data.title,
      description: data.description,
      dimensions: data.dimensions,
      imageUrl: data.imageUrl,
      imageKey: data.imageKey,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured || false,
      isPublished: data.isPublished !== false, // Default to true
    },
    include: { category: true },
  });

  return res.status(201).json({
    success: true,
    data: artwork,
    message: "Artwork created successfully",
  });
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const data: UpdateArtworkData = req.body;

  if (!data.id) {
    return res.status(400).json({
      success: false,
      error: "Artwork ID is required",
    });
  }

  // Check if artwork exists
  const existingArtwork = await prisma.artwork.findUnique({
    where: { id: data.id },
  });

  if (!existingArtwork) {
    return res.status(404).json({
      success: false,
      error: "Artwork not found",
    });
  }

  // If category is being updated, verify it exists
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: "Category not found",
      });
    }
  }

  const artwork = await prisma.artwork.update({
    where: { id: data.id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.dimensions !== undefined && { dimensions: data.dimensions }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
    },
    include: { category: true },
  });

  return res.status(200).json({
    success: true,
    data: artwork,
    message: "Artwork updated successfully",
  });
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Artwork ID is required",
    });
  }

  // Get artwork to delete image from S3
  const artwork = await prisma.artwork.findUnique({
    where: { id: id as string },
  });

  if (!artwork) {
    return res.status(404).json({
      success: false,
      error: "Artwork not found",
    });
  }

  // Delete from database
  await prisma.artwork.delete({
    where: { id: id as string },
  });

  // Delete image from S3
  try {
    await deleteFromS3(artwork.imageKey);
  } catch (error) {
    console.error("Failed to delete image from S3:", error);
    // Continue even if S3 deletion fails
  }

  return res.status(200).json({
    success: true,
    message: "Artwork deleted successfully",
  });
}