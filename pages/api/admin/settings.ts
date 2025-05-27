import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { ApiResponse, SiteSettingsData } from "../../../types";

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
      case "PUT":
        return await handlePut(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: "Method not allowed",
        });
    }
  } catch (error) {
    console.error("Settings API error:", error);
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
  // Get the first (and should be only) settings record
  let settings = await prisma.siteSettings.findFirst();

  // If no settings exist, create default ones
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
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
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: settings,
  });
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const data: SiteSettingsData = req.body;

  // Get existing settings or create new one
  let settings = await prisma.siteSettings.findFirst();

  if (settings) {
    // Update existing settings
    settings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ...(data.artistName !== undefined && { artistName: data.artistName }),
        ...(data.artistBio !== undefined && { artistBio: data.artistBio }),
        ...(data.artistJourney !== undefined && {
          artistJourney: data.artistJourney,
        }),
        ...(data.achievements !== undefined && {
          achievements: data.achievements,
        }),
        ...(data.contactEmail !== undefined && {
          contactEmail: data.contactEmail,
        }),
        ...(data.contactPhone !== undefined && {
          contactPhone: data.contactPhone,
        }),
        ...(data.socialInstagram !== undefined && {
          socialInstagram: data.socialInstagram,
        }),
        ...(data.socialTwitter !== undefined && {
          socialTwitter: data.socialTwitter,
        }),
        ...(data.socialFacebook !== undefined && {
          socialFacebook: data.socialFacebook,
        }),
        ...(data.socialLinkedin !== undefined && {
          socialLinkedin: data.socialLinkedin,
        }),
      },
    });
  } else {
    // Create new settings
    settings = await prisma.siteSettings.create({
      data: {
        artistName: data.artistName || "",
        artistBio: data.artistBio || "",
        artistJourney: data.artistJourney || "",
        achievements: data.achievements || "",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        socialInstagram: data.socialInstagram || "",
        socialTwitter: data.socialTwitter || "",
        socialFacebook: data.socialFacebook || "",
        socialLinkedin: data.socialLinkedin || "",
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: settings,
    message: "Settings updated successfully",
  });
}