import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import {
  Search,
  Filter,
  Grid,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Eye,
} from "lucide-react";
import { ArtworkWithCategory, SiteSettings, Category } from "../types";

interface GalleryProps {
  initialArtworks: ArtworkWithCategory[];
  categories: Category[];
  settings: SiteSettings;
}

export default function Gallery({
  initialArtworks,
  categories,
  settings,
}: GalleryProps) {
  const [artworks, setArtworks] =
    useState<ArtworkWithCategory[]>(initialArtworks);
  const [filteredArtworks, setFilteredArtworks] =
    useState<ArtworkWithCategory[]>(initialArtworks);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [selectedArtwork, setSelectedArtwork] =
    useState<ArtworkWithCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter artworks based on category and search
  useEffect(() => {
    let filtered = artworks;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (artwork) => artwork.categoryId === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          artwork.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArtworks(filtered);
  }, [artworks, selectedCategory, searchTerm]);

  const openLightbox = (artwork: ArtworkWithCategory) => {
    setSelectedArtwork(artwork);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedArtwork(null);
    document.body.style.overflow = "unset";
  };

  const navigateArtwork = (direction: "prev" | "next") => {
    if (!selectedArtwork) return;

    const currentIndex = filteredArtworks.findIndex(
      (a) => a.id === selectedArtwork.id
    );
    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : filteredArtworks.length - 1;
    } else {
      newIndex =
        currentIndex < filteredArtworks.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedArtwork(filteredArtworks[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtwork) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateArtwork("prev");
      if (e.key === "ArrowRight") navigateArtwork("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedArtwork, filteredArtworks]);

  return (
    <Layout settings={settings}>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Gallery
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Explore a curated collection of artistic expressions, where each
              piece tells a unique story and captures moments of creative
              inspiration.
            </p>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-8 mb-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                >
                  <option value="all" className="bg-white dark:bg-gray-900">
                    All Categories
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-white dark:bg-gray-900"
                    >
                      {category.name} ({category._count?.artworks || 0})
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-white/10 rounded-2xl p-2 border border-gray-200/50 dark:border-white/10">
                  <button
                    onClick={() => setViewMode("masonry")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === "masonry"
                        ? "bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-lg transform scale-105"
                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-lg transform scale-105"
                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Showing{" "}
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {filteredArtworks.length}
                </span>{" "}
                of {artworks.length} artworks
              </p>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArtworks.length > 0 ? (
            <div
              className={
                viewMode === "masonry"
                  ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              }
            >
              {filteredArtworks.map((artwork, index) => {
                const aspectRatio =
                  Math.random() > 0.5
                    ? "aspect-[4/5]"
                    : Math.random() > 0.5
                    ? "aspect-square"
                    : "aspect-[3/4]";

                return (
                  <div
                    key={artwork.id}
                    className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 hover:scale-[1.02] ${
                      viewMode === "masonry"
                        ? "break-inside-avoid mb-8"
                        : aspectRatio
                    }`}
                    onClick={() => openLightbox(artwork)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Main Card */}
                    <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-200/50 dark:border-gray-700/50">
                      {/* Image Container with 3D Effect */}
                      <div className="relative overflow-hidden rounded-t-3xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                          style={{
                            minHeight:
                              viewMode === "masonry" ? "300px" : "400px",
                            maxHeight:
                              viewMode === "masonry" ? "600px" : "400px",
                          }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                        {/* Featured Badge */}
                        {artwork.isFeatured && (
                          <div className="absolute top-4 right-4 transform translate-x-16 group-hover:translate-x-0 transition-transform duration-500">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                              <Star size={12} className="fill-current" />
                              <span>Featured</span>
                            </div>
                          </div>
                        )}

                        {/* Hover Icons */}
                        <div className="absolute top-4 left-4 flex space-x-2 transform -translate-x-16 group-hover:translate-x-0 transition-transform duration-500 delay-100">
                          <div className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Eye size={16} />
                          </div>
                          <div className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                            <Heart size={16} />
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 space-y-4">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                            {artwork.title}
                          </h3>
                          <p className="text-purple-600 dark:text-purple-400 font-semibold text-sm mb-3 tracking-wide uppercase">
                            {artwork.category.name}
                          </p>
                        </div>

                        {artwork.description && (
                          <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                              {artwork.description}
                            </p>
                          </div>
                        )}

                        {artwork.dimensions && (
                          <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium tracking-wider">
                              {artwork.dimensions}
                            </p>
                          </div>
                        )}

                        {/* Decorative Elements */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                <Search
                  size={48}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                No artworks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search criteria or browse different categories."
                  : "The gallery is currently being curated. Please check back soon."}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Lightbox */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-16 right-0 text-white hover:text-gray-300 transition-all duration-200 z-10 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {filteredArtworks.length > 1 && (
              <>
                <button
                  onClick={() => navigateArtwork("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-200 z-10 bg-white/10 backdrop-blur-md rounded-full p-4 hover:bg-white/20"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => navigateArtwork("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-200 z-10 bg-white/10 backdrop-blur-md rounded-full p-4 hover:bg-white/20"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Enhanced Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {selectedArtwork.title}
                  </h2>
                  <p className="text-purple-400 text-xl font-semibold mb-2">
                    {selectedArtwork.category.name}
                  </p>
                  {selectedArtwork.dimensions && (
                    <p className="text-gray-400 text-lg">
                      {selectedArtwork.dimensions}
                    </p>
                  )}
                </div>

                {selectedArtwork.description && (
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      About This Piece
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {selectedArtwork.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  {selectedArtwork.isFeatured && (
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold">
                      <Star size={16} className="mr-2 fill-current" />
                      Featured Artwork
                    </div>
                  )}
                </div>

                {/* Navigation Info */}
                {filteredArtworks.length > 1 && (
                  <div className="text-center text-gray-400 text-lg border-t border-white/20 pt-6">
                    <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                      {filteredArtworks.findIndex(
                        (a) => a.id === selectedArtwork.id
                      ) + 1}{" "}
                      of {filteredArtworks.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { prisma } = await import("../lib/prisma");

    const [artworks, categories, settings] = await Promise.all([
      prisma.artwork.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
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
      }),
      prisma.siteSettings.findFirst(),
    ]);

    // Filter categories that have published artworks
    const categoriesWithArtworks = categories.filter(
      (cat) => cat._count.artworks > 0
    );

    return {
      props: {
        initialArtworks: JSON.parse(JSON.stringify(artworks)),
        categories: JSON.parse(JSON.stringify(categoriesWithArtworks)),
        settings: settings
          ? JSON.parse(JSON.stringify(settings))
          : {
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
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
      },
    };
  } catch (error) {
    console.error("Gallery page data fetch error:", error);
    return {
      props: {
        initialArtworks: [],
        categories: [],
        settings: {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }
};