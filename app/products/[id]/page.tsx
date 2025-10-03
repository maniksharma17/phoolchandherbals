"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { addToCart, getProductById, getRandomProducts } from "@/utils/api";
import type { IProduct, IVariant } from "@/types/index";
import { useCartStore } from "@/store/cartStore";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
import { ProductsScrollView } from "@/components/ProductsScrollView";

const AWS = process.env.NEXT_PUBLIC_AWS_URL || "";

export default function ProductPageClient() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [otherProducts, setOtherProducts] = useState<IProduct[]>([]);
  console.log(otherProducts)

  useEffect(() => {
    getRandomProducts(8).then(setOtherProducts);
  }, []);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // place near your existing hooks (alongside selectedVariant, product, etc.)
  const [selectedImage, setSelectedImage] = useState<string | null>(
    selectedVariant?.images?.[0] ?? product?.baseImages?.[0] ?? null
  );

  useEffect(() => {
    // whenever the selected variant or product changes, reset selected image to the first image available
    const imgs =
      selectedVariant?.images && selectedVariant.images.length > 0
        ? selectedVariant.images
        : product?.baseImages ?? [];
    setSelectedImage(imgs[0] ?? null);
  }, [selectedVariant, product]);

  // helper array used in the JSX below
  const imagesList: string[] =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product?.baseImages ?? [];

  // UI state for tabs / accordion
  const tabs = ["Benefits", "Usage", "Ingredients", "Cures"];
  const [activeTab, setActiveTab] = useState<number>(0);
  const [openAccordion, setOpenAccordion] = useState<Record<string, boolean>>({
    Benefits: true,
    Usage: false,
    Ingredients: false,
    Cures: false,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        if (cancelled) return;
        setProduct(data);
        setSelectedVariant(data.variants?.[0] ?? null);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    try {
      await addToCart(product._id, 1, selectedVariant._id)
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  if (loading) {
    return (
      <ProductPageSkeleton />
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-primary">
        <p className="text-white">Product not found.</p>
      </div>
    );
  }

  // safe image helper: prefer selectedVariant image if present
  const getImageSrc = (img?: string) => {
    if (!img) return "/placeholder-product.jpg";
    if (img.startsWith("http")) return img;
    if (!AWS) return img.startsWith("/") ? img : `/${img}`;
    return `${AWS}/${img}`.replace("//", "/").replace(":/", "://"); // normalize
  };

  const isInStock = (selectedVariant?.stock ?? 0) > 0;

  // Toggle mobile accordion sections
  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };



  return (
    <div className="lg:pt-44 pt-24 bg-primary mx-auto min-h-screen">
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 px-4">
        {/* LEFT: Product Images */}
        {/* IMAGES: thumbnails on left (lg vertical), main image on right */}
        <div className="lg:col-span-7">
          <div className="flex max-md:flex-col-reverse lg:flex-row lg:items-start gap-4">
            {/* Thumbnails column */}
            <div className="flex-shrink-0">
              {/* Vertical thumbnails for desktop */}
              <div className="hidden lg:flex flex-col gap-3 max-h-[80vh] overflow-y-auto pr-2 hide-scrollbar">
                {imagesList.map((img, idx) => {
                  const isActive = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      aria-label={`View image ${idx + 1}`}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-shadow ${
                        isActive
                          ? "border border-gray-300"
                          : ""
                      } bg-white`}
                    >
                      <Image
                        src={getImageSrc(img)}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Horizontal thumbnails for mobile */}
              <div className="lg:hidden flex gap-3 mt-3 overflow-x-auto hide-scrollbar">
                {imagesList.map((img, idx) => {
                  const isActive = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      aria-label={`View image ${idx + 1}`}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-shadow ${
                        isActive
                          ? "border border-500"
                          : ""
                      } bg-white`}
                    >
                      <Image
                        src={getImageSrc(img)}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main image */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.995 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
                className="relative aspect-square bg-white rounded-xl overflow-hidden border border-gray-100"
              >
                {selectedImage ? (
                  <Image
                    src={getImageSrc(selectedImage)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50" />
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT: Product Info (on green bg; most text is white) */}
        <div className="flex flex-col lg:col-span-5">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-800 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 flex-wrap">
              <li>
                <a href="/products" className="hover:underline text-gray-800">
                  All Products
                </a>
              </li>
              <li>
                <span className="text-gray-800">/</span>
              </li>
              <li>
                <span className="text-gray-800">
                  {(product as any).category?.name ?? "Category"}
                </span>
              </li>
              <li>
                <span className="text-gray-800">/</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-extrabold text-black mb-2">
            {product.name}
          </h1>

          {/* Product description with Read more */}
          <div className="mb-4">
            <p
              className={`text-gray-800/80 transition-all duration-300 ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {product.description}
            </p>
            {product.description && product.description.length > 120 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm font-medium text-black hover:underline focus:outline-none"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Price & stock (white text on green) */}
          <div className="flex items-center gap-4 mb-6">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-black">
                  ₹{selectedVariant?.price}
                </span>
                {selectedVariant?.cutoffPrice &&
                  selectedVariant.cutoffPrice > selectedVariant.price && (
                    <span className="text-gray-600 line-through">
                      ₹{selectedVariant.cutoffPrice}
                    </span>
                  )}
              </div>
              <div className="mt-1">
                {isInStock ? (
                  <span className="inline-flex items-center gap-2 text-black bg-white px-4 py-1 rounded-full text-sm">
                    In stock
                  </span>
                ) : (
                  <span className="text-white text-sm">Out of stock</span>
                )}
              </div>
            </div>
            {/* weight/dim (small pill) */}
          </div>

          {/* Variants -> black/white components */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v) => {
                  const active = selectedVariant?._id === v._id;
                  return (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-200 hover:border-gray-300"
                      }`}
                      aria-pressed={active}
                    >
                      {v.packSize}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart: black button with white text (contrasts green bg) */}
          <div className="mb-8">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-black/90 w-full flex items-center gap-3"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              Add to Cart
            </Button>
          </div>

          {/* Tabs (desktop) */}
          <div className="hidden lg:block">
            <div className="bg-white text-black rounded-xl shadow-sm border border-gray-100 p-4">
              {/* Tab headers */}
              <div className="flex gap-2 border-b pb-2 overflow-x-auto">
                {tabs.map((t, i) => (
                  <Button
                    key={t}
                    onClick={() => setActiveTab(i)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === i
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    aria-selected={activeTab === i}
                  >
                    {t}
                  </Button>
                ))}
              </div>

              {/* Tab panel */}
              <div className="mt-4">
                {activeTab === 0 && product.benefits && (
                  <div>
                    <h4 className="font-semibold mb-2">Benefits</h4>
                    <ul className="list-none text-sm space-y-1">
                      {product.benefits.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 1 && product.usage && (
                  <div>
                    <h4 className="font-semibold mb-2">Usage</h4>
                    <p className="text-sm">{product.usage}</p>
                  </div>
                )}

                {activeTab === 2 && product.ingredients && (
                  <div>
                    <h4 className="font-semibold mb-2">Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 3 && product.cures && (
                  <div>
                    <h4 className="font-semibold mb-2">Helps With</h4>
                    <ul className="list-none list-inside text-sm space-y-1">
                      {product.cures.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Accordion (mobile) */}
          <div className="block lg:hidden mt-4 space-y-3">
            {product.benefits && (
              <div className="bg-white rounded-lg">
                <button
                  onClick={() => toggleAccordion("Benefits")}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-black font-medium">Benefits</span>
                  <span className="text-black text-sm">
                    {openAccordion.Benefits ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion.Benefits && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="px-4 pb-3 text-sm text-black"
                    >
                      <ul className="list-none list-inside space-y-1">
                        {product.benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {product.usage && (
              <div className="bg-white rounded-lg">
                <button
                  onClick={() => toggleAccordion("Usage")}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-black font-medium">Usage</span>
                  <span className="text-black text-sm">
                    {openAccordion.Usage ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion.Usage && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="px-4 pb-3 text-sm text-black"
                    >
                      <p>{product.usage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {product.ingredients && (
              <div className="bg-white rounded-lg">
                <button
                  onClick={() => toggleAccordion("Ingredients")}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-black font-medium">Ingredients</span>
                  <span className="text-black text-sm">
                    {openAccordion.Ingredients ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion.Ingredients && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="px-4 pb-3 text-sm text-black"
                    >
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm text-black"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {product.cures && (
              <div className="bg-white rounded-lg">
                <button
                  onClick={() => toggleAccordion("Cures")}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-black font-medium">Helps With</span>
                  <span className="text-black text-sm">
                    {openAccordion.Cures ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion.Cures && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="px-4 pb-3 text-sm text-black"
                    >
                      <ul className="list-none list-inside space-y-1">
                        {product.cures.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductsScrollView products={otherProducts} />
    </div>
  );
}
