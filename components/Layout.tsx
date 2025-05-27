import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { SiteSettings } from "../types";

interface LayoutProps {
  children: ReactNode;
  settings?: SiteSettings;
}

export default function Layout({ children, settings }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { icon: Instagram, href: settings?.socialInstagram, name: "Instagram" },
    { icon: Twitter, href: settings?.socialTwitter, name: "Twitter" },
    { icon: Facebook, href: settings?.socialFacebook, name: "Facebook" },
    { icon: Linkedin, href: settings?.socialLinkedin, name: "LinkedIn" },
  ].filter((link) => link.href);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-md py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              {settings?.artistName || "Art Gallery"}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-purple-400 relative group ${
                    router.pathname === item.href
                      ? "text-purple-400"
                      : "text-white"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-200 ${
                      router.pathname === item.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Social Links - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:text-purple-400 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-md px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium transition-colors duration-200 hover:text-purple-400 ${
                  router.pathname === item.href
                    ? "text-purple-400"
                    : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Social Links */}
            {socialLinks.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                      >
                        <Icon size={24} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-gray-900 to-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Artist Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {settings?.artistName || "Art Gallery"}
              </h3>
              {settings?.artistBio && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {settings.artistBio.substring(0, 150)}
                  {settings.artistBio.length > 150 ? "..." : ""}
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
              <div className="space-y-2">
                {settings?.contactEmail && (
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Mail size={16} />
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="hover:text-purple-400 transition-colors duration-200"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                )}
                {settings?.contactPhone && (
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Phone size={16} />
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="hover:text-purple-400 transition-colors duration-200"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex space-x-4 pt-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-all duration-200 transform hover:scale-110"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()}{" "}
              {settings?.artistName || "Art Gallery"}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}