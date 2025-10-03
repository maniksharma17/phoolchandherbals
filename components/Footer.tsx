"use client";

import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { LOGO } from "@/config";
import Image from "next/image";

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="text-xl flex flex-col items-start sm:flex-row sm:items-center gap-4">
              <Image
                src={LOGO}
                alt={"Phoolchand herbals"}
                width={80}
                height={80}
                className="rounded-full"
              ></Image>
              <div className="flex flex-col">
                <h3 className="text-white font-medium">Phoolchand Herbals</h3>
                <p className="text-gray-400 text-sm leading-tight font-light">
                  Authentic ayurvedic products crafted with tradition and care.
                </p>
                <div className="flex space-x-2 mt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </a>
                );
              })}
            </div>
              </div>
              
            </div>

            {/* Social Links */}
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-medium mb-3">Contact Info</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@phoolchand.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  123 Business Street
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} Phoolchand Herbals Pvt Ltd. All rights
            reserved.
          </p>
          <div className="flex space-x-5 mt-4 sm:mt-0 text-xs sm:text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/sitemap"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
