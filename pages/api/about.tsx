import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { Award, Heart, Palette, Star, Calendar, MapPin } from "lucide-react";
import { SiteSettings } from "../types";

interface AboutProps {
  settings: SiteSettings;
}

export default function About({ settings }: AboutProps) {
  const timelineEvents = [
    { year: "2020", event: "Started digital art journey", icon: Palette },
    { year: "2021", event: "First gallery exhibition", icon: Star },
    { year: "2022", event: "Art award recognition", icon: Award },
    { year: "2023", event: "International showcase", icon: MapPin },
    { year: "2024", event: "Current works", icon: Heart },
  ];

  return (
    <Layout settings={settings}>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    About
                  </span>
                  <br />
                  <span className="text-white">
                    {settings.artistName || "The Artist"}
                  </span>
                </h1>

                {settings.artistBio && (
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {settings.artistBio}
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    50+
                  </div>
                  <div className="text-gray-400 text-sm">Artworks Created</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    5+
                  </div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Profile Image Placeholder */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Palette size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {settings.artistName || "Artist Name"}
                </h3>
                <p className="text-purple-300 font-medium">
                  Visual Artist & Creator
                </p>

                {/* Contact Info */}
                <div className="mt-6 space-y-2">
                  {settings.contactEmail && (
                    <p className="text-gray-400 text-sm">
                      {settings.contactEmail}
                    </p>
                  )}
                  {settings.contactPhone && (
                    <p className="text-gray-400 text-sm">
                      {settings.contactPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artistic Journey Section */}
      {settings.artistJourney && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                My Artistic Journey
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                The path that led me to where I am today
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {settings.artistJourney}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Creative Timeline
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Key milestones in my artistic development
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />

            <div className="space-y-12">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`flex items-center ${
                      isEven ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`w-full max-w-md ${
                        isEven ? "text-right pr-8" : "text-left pl-8"
                      }`}
                    >
                      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div
                          className={`flex items-center space-x-3 mb-3 ${
                            isEven ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`${
                              isEven ? "order-2" : "order-1"
                            } w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center`}
                          >
                            <Icon size={20} className="text-white" />
                          </div>
                          <div
                            className={`${
                              isEven ? "order-1" : "order-2"
                            } text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}
                          >
                            {event.year}
                          </div>
                        </div>
                        <p className="text-gray-300 font-medium">
                          {event.event}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full border-4 border-black" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      {settings.achievements && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Achievements & Recognition
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Milestones and honors in my artistic career
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
                <div className="prose prose-lg prose-gray max-w-none">
                  <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {settings.achievements
                      .split("\n")
                      .map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 mb-4"
                        >
                          <Award
                            size={20}
                            className="text-purple-400 mt-1 flex-shrink-0"
                          />
                          <p className="m-0">{achievement}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Creative Philosophy
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles and beliefs that guide my artistic expression
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Passion Driven
              </h3>
              <p className="text-gray-400">
                Every piece I create comes from a place of genuine passion and
                emotional connection to the subject.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Palette size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Innovative Techniques
              </h3>
              <p className="text-gray-400">
                I constantly experiment with new techniques and mediums to push
                the boundaries of traditional art.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Meaningful Impact
              </h3>
              <p className="text-gray-400">
                Art should evoke emotion and create connections between people,
                inspiring positive change in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Let's Create Something Beautiful Together
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              I'm always excited to connect with fellow art enthusiasts,
              potential collaborators, and anyone who shares a passion for
              creative expression.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
              >
                Get In Touch
              </a>
              <a
                href="/gallery"
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
              >
                View My Work
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { prisma } = await import("../lib/prisma");

    const settings = await prisma.siteSettings.findFirst();

    return {
      props: {
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
    console.error("About page data fetch error:", error);
    return {
      props: {
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