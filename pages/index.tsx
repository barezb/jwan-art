import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { ArrowRight, Eye, Star, Sparkles } from "lucide-react";
import { ArtworkWithCategory, SiteSettings } from "../types";

interface HomeProps {
  featuredArtworks: ArtworkWithCategory[];
  settings: SiteSettings;
}

export default function Home({ featuredArtworks, settings }: HomeProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate featured images
    if (featuredArtworks.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % featuredArtworks.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredArtworks.length]);

  const currentArtwork = featuredArtworks[currentImageIndex];

  return (
    <Layout settings={settings}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
        {/* Background Image */}
        {currentArtwork && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${currentArtwork.imageUrl})`,
              filter: "brightness(0.4) blur(2px)",
              transform: `scale(${1.1 + currentImageIndex * 0.02})`,
            }}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60 dark:from-black/70 dark:via-black/50 dark:to-black/70 transition-colors duration-300" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                size={Math.random() * 20 + 10}
                className="text-purple-600/30 dark:text-purple-400/30"
              />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                {settings.artistName || "Welcome to"}
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                {settings.artistName ? "Art Gallery" : "My Art Gallery"}
              </span>
            </h1>

            {settings.artistBio && (
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {settings.artistBio}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/gallery"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 flex items-center space-x-2"
              >
                <Eye size={24} />
                <span>Explore Gallery</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>

              <Link
                href="/about"
                className="group border-2 border-gray-400 dark:border-white/30 text-gray-700 dark:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-purple-600 dark:hover:border-white/50 backdrop-blur-sm flex items-center space-x-2"
              >
                <Star size={24} />
                <span>About Artist</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Image Navigation Dots */}
        {featuredArtworks.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {featuredArtworks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-purple-600 scale-125"
                    : "bg-gray-400 dark:bg-white/30 hover:bg-purple-400 dark:hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-500 dark:border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 dark:bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      {featuredArtworks.length > 0 && (
        <section className="py-20 bg-white dark:bg-gradient-to-b dark:from-black dark:to-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Featured Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover a curated selection of my most captivating pieces
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.slice(0, 6).map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star size={12} />
                      <span>Featured</span>
                    </div>

                    {/* Hover Content */}
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-2">
                        {artwork.category.name}
                      </p>
                      {artwork.description && (
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {artwork.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/gallery"
                className="group inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <span>View All Artworks</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Preview Section */}
      {(settings.artistJourney || settings.achievements) && (
        <section className="py-20 bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                  About the Artist
                </h2>

                {settings.artistJourney && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Artistic Journey
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {settings.artistJourney.substring(0, 300)}
                      {settings.artistJourney.length > 300 ? "..." : ""}
                    </p>
                  </div>
                )}

                <Link
                  href="/about"
                  className="group inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors duration-200"
                >
                  <span>Learn More About Me</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
              </div>

              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
                <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Get in Touch
                      </h4>
                      <div className="space-y-2">
                        {settings.contactEmail && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {settings.contactEmail}
                          </p>
                        )}
                        {settings.contactPhone && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {settings.contactPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                    >
                      Contact Me
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { prisma } = await import("../lib/prisma");

    const [featuredArtworks, settings] = await Promise.all([
      prisma.artwork.findMany({
        where: {
          isFeatured: true,
          isPublished: true,
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.siteSettings.findFirst(),
    ]);

    return {
      props: {
        featuredArtworks: JSON.parse(JSON.stringify(featuredArtworks)),
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
    console.error("Home page data fetch error:", error);
    return {
      props: {
        featuredArtworks: [],
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
