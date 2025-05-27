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

  const getMasonryItemHeight = (index: number) => {
    const heights = ["h-64", "h-80", "h-96", "h-72", "h-88"];
    return heights[index % heights.length];
  };

  return (
    <Layout settings={settings}>
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Art Gallery
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore my collection of artworks across different styles and
              mediums
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all" className="bg-gray-900">
                    All Categories
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-gray-900"
                    >
                      {category.name} ({category._count?.artworks || 0})
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("masonry")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "masonry"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-center">
              <p className="text-gray-400">
                Showing {filteredArtworks.length} of {artworks.length} artworks
                {selectedCategory !== "all" && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-600/20 text-purple-300">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArtworks.length > 0 ? (
            <div
              className={
                viewMode === "masonry"
                  ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            >
              {filteredArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 ${
                    viewMode === "masonry"
                      ? `break-inside-avoid mb-6 ${getMasonryItemHeight(index)}`
                      : "aspect-square"
                  }`}
                  onClick={() => openLightbox(artwork)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {artwork.title}
                    </h3>
                    <p className="text-purple-300 text-sm mb-2">
                      {artwork.category.name}
                    </p>
                    {artwork.description && (
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {artwork.description}
                      </p>
                    )}
                    {artwork.dimensions && (
                      <p className="text-gray-400 text-xs mt-2">
                        {artwork.dimensions}
                      </p>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {artwork.isFeatured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No artworks found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "No artworks available at the moment"}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            {filteredArtworks.length > 1 && (
              <>
                <button
                  onClick={() => navigateArtwork("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/50 rounded-full p-2"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={() => navigateArtwork("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/50 rounded-full p-2"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                />
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedArtwork.title}
                  </h2>
                  <p className="text-purple-300 text-lg">
                    {selectedArtwork.category.name}
                  </p>
                  {selectedArtwork.dimensions && (
                    <p className="text-gray-400 mt-2">
                      {selectedArtwork.dimensions}
                    </p>
                  )}
                </div>

                {selectedArtwork.description && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedArtwork.description}
                    </p>
                  </div>
                )}

                {selectedArtwork.isFeatured && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold">
                    ⭐ Featured Artwork
                  </div>
                )}

                {/* Navigation Info */}
                {filteredArtworks.length > 1 && (
                  <div className="text-center text-gray-400 text-sm">
                    {filteredArtworks.findIndex(
                      (a) => a.id === selectedArtwork.id
                    ) + 1}{" "}
                    of {filteredArtworks.length}
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