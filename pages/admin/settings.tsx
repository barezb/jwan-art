import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import {
  Save,
  User,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { SiteSettings } from "../../types";

interface SettingsPageProps {
  initialSettings: SiteSettings;
}

export default function SettingsPage({ initialSettings }: SettingsPageProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
        setSuccess("Settings updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Failed to update settings");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Site Settings">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Site Settings
            </h1>
            <p className="text-gray-600">
              Manage your artist profile, contact information, and social media
              links
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Artist Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <User className="mr-3 text-purple-600" size={24} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Artist Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={settings.artistName || ""}
                    onChange={(e) =>
                      handleInputChange("artistName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artist Bio
                  </label>
                  <textarea
                    value={settings.artistBio || ""}
                    onChange={(e) =>
                      handleInputChange("artistBio", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell visitors about yourself..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artistic Journey
                  </label>
                  <textarea
                    value={settings.artistJourney || ""}
                    onChange={(e) =>
                      handleInputChange("artistJourney", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Share your artistic journey and inspiration..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achievements
                  </label>
                  <textarea
                    value={settings.achievements || ""}
                    onChange={(e) =>
                      handleInputChange("achievements", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="List your achievements, exhibitions, awards..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Mail className="mr-3 text-purple-600" size={24} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail || ""}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.contactPhone || ""}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Instagram className="mr-3 text-purple-600" size={24} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Social Media Links
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Instagram size={16} className="inline mr-2" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={settings.socialInstagram || ""}
                    onChange={(e) =>
                      handleInputChange("socialInstagram", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Twitter size={16} className="inline mr-2" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={settings.socialTwitter || ""}
                    onChange={(e) =>
                      handleInputChange("socialTwitter", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Facebook size={16} className="inline mr-2" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={settings.socialFacebook || ""}
                    onChange={(e) =>
                      handleInputChange("socialFacebook", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Linkedin size={16} className="inline mr-2" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinkedin || ""}
                    onChange={(e) =>
                      handleInputChange("socialLinkedin", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Preview Site
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{loading ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Preview
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {settings.artistName || "Your Name"}
                </h4>
                <p className="text-gray-600 mb-4">
                  {settings.artistBio || "Your bio will appear here..."}
                </p>

                <div className="flex justify-center space-x-4 mb-4">
                  {settings.socialInstagram && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Instagram size={16} className="text-purple-600" />
                    </div>
                  )}
                  {settings.socialTwitter && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Twitter size={16} className="text-purple-600" />
                    </div>
                  )}
                  {settings.socialFacebook && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Facebook size={16} className="text-purple-600" />
                    </div>
                  )}
                  {settings.socialLinkedin && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Linkedin size={16} className="text-purple-600" />
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  {settings.contactEmail && (
                    <div className="flex items-center justify-center">
                      <Mail size={14} className="mr-2" />
                      {settings.contactEmail}
                    </div>
                  )}
                  {settings.contactPhone && (
                    <div className="flex items-center justify-center">
                      <Phone size={14} className="mr-2" />
                      {settings.contactPhone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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

    return {
      props: {
        initialSettings: JSON.parse(JSON.stringify(settings)),
      },
    };
  } catch (error) {
    console.error("Settings page data fetch error:", error);
    return {
      props: {
        initialSettings: {
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