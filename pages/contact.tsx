import { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  CheckCircle,
} from "lucide-react";
import { SiteSettings } from "../types";

interface ContactProps {
  settings: SiteSettings;
}

export default function Contact({ settings }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Send form data to contact API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      icon: Instagram,
      href: settings.socialInstagram,
      name: "Instagram",
      color: "hover:text-pink-400",
    },
    {
      icon: Twitter,
      href: settings.socialTwitter,
      name: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Facebook,
      href: settings.socialFacebook,
      name: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: Linkedin,
      href: settings.socialLinkedin,
      name: "LinkedIn",
      color: "hover:text-blue-600",
    },
  ].filter((link) => link.href);

  return (
    <Layout settings={settings}>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              I'd love to hear from you. Whether you have a question about my
              work, want to collaborate, or just want to say hello.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-white mb-8">
                Send a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Your message has been sent successfully. I'll get back to
                    you as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Tell me more about your inquiry..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  {settings.contactEmail && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Mail size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <a
                          href={`mailto:${settings.contactEmail}`}
                          className="text-white hover:text-purple-400 transition-colors duration-200 font-medium"
                        >
                          {settings.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings.contactPhone && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Phone size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <a
                          href={`tel:${settings.contactPhone}`}
                          className="text-white hover:text-purple-400 transition-colors duration-200 font-medium"
                        >
                          {settings.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-medium">
                        Available Worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Follow My Work
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${social.color} group`}
                        >
                          <Icon size={24} />
                          <span className="font-medium">{social.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Response Time */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Response Time
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Email Inquiries</span>
                    <span className="text-purple-400 font-medium">
                      24-48 hours
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Commission Requests</span>
                    <span className="text-purple-400 font-medium">
                      1-3 business days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      Collaboration Proposals
                    </span>
                    <span className="text-purple-400 font-medium">
                      3-5 business days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Do you take commission work?",
                answer:
                  "Yes! I love working on custom pieces. Please reach out with your ideas and I'll provide a quote and timeline.",
              },
              {
                question: "How long does a typical piece take to complete?",
                answer:
                  "It depends on the complexity and size, but most pieces take 2-4 weeks from concept to completion.",
              },
              {
                question: "Are prints of your work available?",
                answer:
                  "Selected works are available as high-quality prints. Contact me for availability and pricing.",
              },
              {
                question: "Do you offer art workshops or tutorials?",
                answer:
                  "I occasionally host workshops and am always open to teaching opportunities. Let me know your interest!",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
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
    console.error("Contact page data fetch error:", error);
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