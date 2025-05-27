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
    let settings = await prisma.siteSettings.findFirst();

    // If no settings exist, return default values
    if (!settings) {
      settings = {
        id: "",
        artistName: "",
        artistBio: "",
        artistJourney: "",
        achievements: "",
        contactEmail: "",
        contactPhone: "",
        socialInstagram: "",
        socialTwitter: "",
        socialFacebook: "",
        socialLinkedin: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Public settings API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}