import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            artworks: {
              where: { isPublished: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Only return categories that have published artworks
    const categoriesWithArtworks = categories.filter(
      (cat) => cat._count.artworks > 0
    );

    return res.status(200).json({
      success: true,
      data: categoriesWithArtworks,
    });
  } catch (error) {
    console.error("Public categories API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}