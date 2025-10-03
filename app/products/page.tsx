"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Grid3x3 as Grid3X3, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import FilterModal from "@/components/FilterModal";
import { PageLoader, Loader } from "@/components/ui/loader";
import { getProducts, searchProducts, getCategories } from "@/utils/api";
import type { IProduct, ICategory } from "@/types/index";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

export default function ProductsPageClient() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Filters & UI state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // multi-select
  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [showFilterModal, setShowFilterModal] = useState(false);

  const productsPerPage = 12;

  // initial load
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods : []);
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // re-filter on dependencies
  useEffect(() => {
    filterAndSortProducts();
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchQuery, selectedCategories, sortOption]);

  // Helpers to compute price ranges
  const getMinPrice = (p: IProduct): number => {
    if (!p.variants || p.variants.length === 0) return 0;
    return Math.min(...p.variants.map((v) => v.price));
  };
  const getMaxPrice = (p: IProduct): number => {
    if (!p.variants || p.variants.length === 0) return 0;
    return Math.max(...p.variants.map((v) => v.price));
  };

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Category filter: if selectedCategories has values, keep products that match any of them
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        const cat = (product as any).category;
        if (!cat) return false;
        if (typeof cat === "string") return selectedCategories.includes(cat);
        if (typeof cat === "object")
          return (
            selectedCategories.includes(cat._id) ||
            selectedCategories.includes(cat.slug)
          );
        return false;
      });
    }

    // Search filter (client-side)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(q);
        const descMatch = product.description?.toLowerCase().includes(q);
        const tagsMatch = product.tags?.some((t) =>
          t.toLowerCase().includes(q)
        );
        return Boolean(nameMatch || descMatch || tagsMatch);
      });
    }

    // Sorting
    switch (sortOption) {
      case "price_low":
        filtered.sort((a, b) => getMinPrice(a) - getMinPrice(b));
        break;
      case "price_high":
        filtered.sort((a, b) => getMaxPrice(b) - getMaxPrice(a));
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        filtered.sort((a, b) => {
          const aTime = (a as any).createdAt
            ? new Date((a as any).createdAt).getTime()
            : 0;
          const bTime = (b as any).createdAt
            ? new Date((b as any).createdAt).getTime()
            : 0;
          if (aTime || bTime) return bTime - aTime;
          return b._id.localeCompare(a._id);
        });
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategories, sortOption]);

  // Search handler (server search)
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      // reset to all products (client-side)
      setProducts(await getProducts());
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchProducts(query, {
        categories: selectedCategories.length ? selectedCategories : undefined,
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Multi-select toggle for desktop (applies immediately)
  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  // Called when mobile sheet applies changes
  const applyMobileFilters = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSearchQuery("");
    setSortOption("newest");
  }, []);

  // Pagination derived values
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (isLoading) return <PageLoader />;

  return (
    <div className="pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Timeless <span className="gradient-text">Ayurvedic Healing</span>{" "}
            for Modern Living
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic, hand-crafted remedies rooted in tradition since
            1928 — because true wellness never goes out of style.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            {/* Search in sidebar (desktop) */}
            <div className="mb-6 sticky top-40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for herbs or remedies..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader size="sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Categories (checkboxes) */}
            <div className="sticky top-56 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Filter by Category
              </h3>
              <div className="space-y-2">
                {categories.map((c) => {
                  const active = selectedCategories.includes(c._id);
                  return (
                    <label
                      key={c._id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleCategory(c._id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{c.name}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => {
                    setSelectedCategories([]);
                    fetchFilteredProducts();
                  }}
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </div>
          </aside>

          {/* Products */}
          <section className="lg:col-span-3">
            {/* Mobile search + small controls */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader size="sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Results info + view controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid" ? "bg-primary text-white" : "bg-white"
                    }`}
                    aria-pressed={viewMode === "grid"}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list" ? "bg-primary text-white" : "bg-white"
                    }`}
                    aria-pressed={viewMode === "list"}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid/list */}
            {currentProducts.length > 0 ? (
              <div
                className={`grid gap-0 lg:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No products found.</p>
                {(searchQuery || selectedCategories.length > 0) && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategories([]);
                    }}
                    variant="secondary"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination would go here (omitted for brevity) */}
          </section>
        </div>

        {/* Floating Filter Button (mobile) */}
        <div className="lg:hidden fixed bottom-6 left-4 z-40">
          <Button
            onClick={() => setShowFilterModal(true)}
            className="rounded-full px-4 py-3 shadow-lg flex items-center gap-2"
          >
            <Filter className="h-4 w-4" /> Filters{" "}
            {selectedCategories.length > 0 && (
              <span className="ml-1 inline-block bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </Button>
        </div>

        {/* FilterModal (mobile) */}
        <FilterModal
          open={showFilterModal}
          categories={categories}
          initialSelected={selectedCategories}
          onApply={(selected) => applyMobileFilters(selected)}
          onClose={() => setShowFilterModal(false)}
          onReset={() => setSelectedCategories([])}
        />
      </div>
    </div>
  );

  // helper (optional) to refresh products after clearing
  async function fetchFilteredProducts() {
    try {
      setIsLoading(true);
      const prods = await getProducts();
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
}
