"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, LogOut, Package, ArrowUpRight } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { LOGO } from "@/config";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const pathname = usePathname();
  const { cart, fetchCart } = useCartStore();
  const [itemsCount, setItemsCount] = useState(0);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const count = cart?.items?.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ) || 0;
    setItemsCount(count);
  }, [cart]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const navLinks = [{ name: "Products", href: "/products" }];
  const isProductDetailPage =
    pathname.startsWith("/products/") && pathname !== "/products";

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } ${
          isProductDetailPage || pathname == "/order-confirmation"
            ? "bg-white"
            : "bg-primary"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-16 sm:h-20">
            
            {/* LEFT: nav links */}
            <div className="flex-1 flex items-center">
              <div className="flex items-center space-x-4 sm:space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex flex-row gap-1 items-center text-black hover:text-black/80 transition-colors text-sm sm:text-lg uppercase font-medium"
                  >
                    {link.name}
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* CENTER: logo */}
            <div className="absolute left-1/2 bottom-1 sm:bottom-2 transform -translate-x-1/2 translate-y-1/2">
              <Link href="/" aria-label="Home">
                <Image
                  src={LOGO}
                  width={96}
                  height={96}
                  className="rounded-full h-16 w-16 sm:h-24 sm:w-24 shadow-lg"
                  alt="Phoolchand Herbals"
                />
              </Link>
            </div>

            {/* RIGHT: actions */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
              {isAuthenticated ? (
                <>
                  
                  <button
                    onClick={logout}
                    className="p-2 rounded-md hover:bg-white/10"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </button>
                  <Link href="/orders">
                    <button className="p-2 rounded-md hover:bg-white/10">
                      <Package className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/auth/login">
                  <button className="p-2 rounded-md hover:bg-white/10">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </button>
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Open cart"
                  className="p-2 rounded-md hover:bg-white/10"
                >
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                </button>
                {itemsCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 rounded-full text-xs font-bold ${
                      isProductDetailPage
                        ? "bg-primary text-white"
                        : "bg-black text-white"
                    }`}
                  >
                    {itemsCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
