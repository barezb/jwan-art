import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import ImageUpload from "../../components/ImageUpload";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  X,
  Search,
  Filter,
} from "lucide-react";
import {
  ArtworkWithCategory,
  Category,
  CreateArtworkData,
  UploadImageResponse,
} from "../../types";

interface ArtworksPageProps {
  initialArtworks: ArtworkWithCategory[];
  categories: Category[];
  totalCount: number;
}

export default function ArtworksPage({
  initialArtworks,
  categories,
  totalCount,
}: ArtworksPageProps) {
  const [artworks, setArtworks] =
    useState<ArtworkWithCategory[]>(initialArtworks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] =
    useState<ArtworkWithCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dimensions: "",
    categoryId: "",
    isFeatured: false,
    isPublished: true,
  });
  const [uploadedImage, setUploadedImage] =
    useState<UploadImageResponse | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dimensions: "",
      categoryId: categories[0]?.id || "",
      isFeatured: false,
      isPublished: true,
    });
    setUploadedImage(null);
    setEditingArtwork(null);
    setError("");
  };

  const openModal = (artwork?: ArtworkWithCategory) => {
    if (artwork) {
      setEditingArtwork(artwork);
      setFormData({
        title: artwork.title,
        description: artwork.description || "",
        dimensions: artwork.dimensions || "",
        categoryId: artwork.categoryId,
        isFeatured: artwork.isFeatured,
        isPublished: artwork.isPublished,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dataToSend = {
        ...formData,
        ...(uploadedImage && {
          imageUrl: uploadedImage.imageUrl,
          imageKey: uploadedImage.imageKey,
        }),
      };

      const url = "/api/admin/artworks";
      const method = editingArtwork ? "PUT" : "POST";

      if (editingArtwork) {
        (dataToSend as any).id = editingArtwork.id;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        if (editingArtwork) {
          setArtworks((prev) =>
            prev.map((a) => (a.id === editingArtwork.id ? result.data : a))
          );
        } else {
          setArtworks((prev) => [result.data, ...prev]);
        }
        closeModal();
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (artwork: ArtworkWithCategory) => {
    if (!confirm(`Are you sure you want to delete "${artwork.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/artworks?id=${artwork.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setArtworks((prev) => prev.filter((a) => a.id !== artwork.id));
      } else {
        alert(result.error || "Failed to delete artwork");
      }
    } catch (error) {
      alert("Network error occurred");
    }
  };

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || artwork.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout title="Artworks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Artworks</h1>
            <p className="text-gray-600">Manage your artwork collection</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Artwork</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="all">All</option>
                    <option value="featured">Featured Only</option>
                    <option value="not-featured">Not Featured</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Artworks Grid */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group"
              >
                <div className="aspect-square relative">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => openModal(artwork)}
                      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(artwork)}
                      className="bg-red-500/80 hover:bg-red-600/80 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      {artwork.isFeatured && (
                        <Star
                          size={16}
                          className="text-yellow-500 fill-current"
                        />
                      )}
                      {artwork.isPublished ? (
                        <Eye size={16} className="text-green-500" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {artwork.category.name}
                  </p>

                  {artwork.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {artwork.description}
                    </p>
                  )}

                  {artwork.dimensions && (
                    <p className="text-xs text-gray-400 mt-2">
                      {artwork.dimensions}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        artwork.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {artwork.isPublished ? "Published" : "Draft"}
                    </span>

                    <span className="text-xs text-gray-500">
                      {new Date(artwork.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No artworks found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first artwork"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <button
                onClick={() => openModal()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add First Artwork
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
                onClick={closeModal}
              />

              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    onClick={closeModal}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">
                      {editingArtwork ? "Edit Artwork" : "Add New Artwork"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Artwork Image
                        </label>
                        <ImageUpload
                          onUpload={setUploadedImage}
                          onError={setError}
                          currentImage={editingArtwork?.imageUrl}
                          disabled={loading}
                        />
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter artwork title"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              categoryId: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Describe your artwork..."
                        />
                      </div>

                      {/* Dimensions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={formData.dimensions}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              dimensions: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., 24 x 36 inches"
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={formData.isFeatured}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isFeatured: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="featured"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Feature on homepage
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="published"
                            checked={formData.isPublished}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isPublished: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="published"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Publish artwork
                          </label>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 pt-6">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={
                            loading || (!editingArtwork && !uploadedImage)
                          }
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading
                            ? "Saving..."
                            : editingArtwork
                            ? "Update Artwork"
                            : "Add Artwork"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

    const [artworks, categories] = await Promise.all([
      prisma.artwork.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 50, // Limit for initial load
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      props: {
        initialArtworks: JSON.parse(JSON.stringify(artworks)),
        categories: JSON.parse(JSON.stringify(categories)),
        totalCount: artworks.length,
      },
    };
  } catch (error) {
    console.error("Artworks page data fetch error:", error);
    return {
      props: {
        initialArtworks: [],
        categories: [],
        totalCount: 0,
      },
    };
  }
};