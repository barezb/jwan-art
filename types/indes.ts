import { Artwork, Category, SiteSettings, User } from "@prisma/client";

export interface ArtworkWithCategory extends Artwork {
  category: Category;
}

export interface CreateArtworkData {
  title: string;
  description?: string;
  dimensions?: string;
  categoryId: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface UpdateArtworkData extends Partial<CreateArtworkData> {
  id: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

export interface SiteSettingsData {
  artistName?: string;
  artistBio?: string;
  artistJourney?: string;
  achievements?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialFacebook?: string;
  socialLinkedin?: string;
}

export interface UploadImageResponse {
  imageUrl: string;
  imageKey: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GalleryFilters {
  categoryId?: string;
  featured?: boolean;
  published?: boolean;
}

export interface DashboardStats {
  totalArtworks: number;
  totalCategories: number;
  featuredArtworks: number;
  publishedArtworks: number;
}

export type { Artwork, Category, SiteSettings, User };
