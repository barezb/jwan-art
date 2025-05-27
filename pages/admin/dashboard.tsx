import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import { Image, FolderOpen, Star, Eye } from "lucide-react";
import { DashboardStats, ArtworkWithCategory } from "../../types";

interface DashboardProps {
  initialStats: DashboardStats;
  recentArtworks: ArtworkWithCategory[];
}

export default function Dashboard({
  initialStats,
  recentArtworks,
}: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);

  const statCards = [
    {
      title: "Total Artworks",
      value: stats.totalArtworks,
      icon: Image,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Featured",
      value: stats.featuredArtworks,
      icon: Star,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Published",
      value: stats.publishedArtworks,
      icon: Eye,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-purple-100">
            Manage your art gallery and showcase your creativity to the world.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Artworks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Artworks
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Your latest additions to the gallery
            </p>
          </div>

          {recentArtworks.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArtworks.map((artwork) => (
                  <div key={artwork.id} className="group cursor-pointer">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {artwork.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {artwork.category.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {artwork.isFeatured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star size={12} className="mr-1" />
                            Featured
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            artwork.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {artwork.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Image size={48} className="mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No artworks yet
              </h4>
              <p className="text-gray-600 mb-4">
                Start by adding your first artwork to the gallery.
              </p>
              <button
                onClick={() => (window.location.href = "/admin/artworks")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add Artwork
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => (window.location.href = "/admin/artworks")}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Image size={24} className="text-purple-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Manage Artworks
            </h3>
            <p className="text-sm text-gray-600">
              Add, edit, or organize your artwork collection
            </p>
          </button>

          <button
            onClick={() => (window.location.href = "/admin/categories")}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FolderOpen size={24} className="text-green-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Manage Categories
            </h3>
            <p className="text-sm text-gray-600">
              Organize your artworks by categories
            </p>
          </button>

          <button
            onClick={() => (window.location.href = "/admin/settings")}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Site Settings</h3>
            <p className="text-sm text-gray-600">
              Update your bio, contact info, and more
            </p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  try {
    const { prisma } = await import("../../lib/prisma");

    // Get dashboard stats
    const [
      totalArtworks,
      totalCategories,
      featuredArtworks,
      publishedArtworks,
      artworks,
    ] = await Promise.all([
      prisma.artwork.count(),
      prisma.category.count(),
      prisma.artwork.count({ where: { isFeatured: true } }),
      prisma.artwork.count({ where: { isPublished: true } }),
      prisma.artwork.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

    const stats: DashboardStats = {
      totalArtworks,
      totalCategories,
      featuredArtworks,
      publishedArtworks,
    };

    return {
      props: {
        initialStats: stats,
        recentArtworks: JSON.parse(JSON.stringify(artworks)),
      },
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return {
      props: {
        initialStats: {
          totalArtworks: 0,
          totalCategories: 0,
          featuredArtworks: 0,
          publishedArtworks: 0,
        },
        recentArtworks: [],
      },
    };
  }
};