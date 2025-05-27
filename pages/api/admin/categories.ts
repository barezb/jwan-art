import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import {
  ApiResponse,
  CreateCategoryData,
  UpdateCategoryData,
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
    console.error("Categories API error:", error);
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
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { artworks: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return res.status(200).json({
    success: true,
    data: categories,
  });
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const data: CreateCategoryData = req.body;

  if (!data.name) {
    return res.status(400).json({
      success: false,
      error: "Category name is required",
    });
  }

  // Generate slug from name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check if name or slug already exists
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: slug }],
    },
  });

  if (existingCategory) {
    return res.status(400).json({
      success: false,
      error: "Category name already exists",
    });
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
    include: {
      _count: {
        select: { artworks: true },
      },
    },
  });

  return res.status(201).json({
    success: true,
    data: category,
    message: "Category created successfully",
  });
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const data: UpdateCategoryData = req.body;

  if (!data.id) {
    return res.status(400).json({
      success: false,
      error: "Category ID is required",
    });
  }

  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: data.id },
  });

  if (!existingCategory) {
    return res.status(404).json({
      success: false,
      error: "Category not found",
    });
  }

  const updateData: any = {};

  if (data.name) {
    // Generate new slug if name is changing
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if new name or slug conflicts with existing categories
    const conflictingCategory = await prisma.category.findFirst({
      where: {
        AND: [
          { id: { not: data.id } },
          {
            OR: [{ name: data.name }, { slug: slug }],
          },
        ],
      },
    });

    if (conflictingCategory) {
      return res.status(400).json({
        success: false,
        error: "Category name already exists",
      });
    }

    updateData.name = data.name;
    updateData.slug = slug;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  const category = await prisma.category.update({
    where: { id: data.id },
    data: updateData,
    include: {
      _count: {
        select: { artworks: true },
      },
    },
  });

  return res.status(200).json({
    success: true,
    data: category,
    message: "Category updated successfully",
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
      error: "Category ID is required",
    });
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: id as string },
    include: {
      _count: {
        select: { artworks: true },
      },
    },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      error: "Category not found",
    });
  }

  // Check if category has artworks
  if (category._count.artworks > 0) {
    return res.status(400).json({
      success: false,
      error: `Cannot delete category with ${category._count.artworks} artworks. Please move or delete the artworks first.`,
    });
  }

  // Delete category
  await prisma.category.delete({
    where: { id: id as string },
  });

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
}