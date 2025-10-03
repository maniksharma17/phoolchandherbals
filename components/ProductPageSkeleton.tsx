'use client';

import React from 'react';

export default function ProductPageSkeleton() {
  return (
    <div className="min-h-screen pt-32 bg-primary pb-16 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        {/* LEFT: Images */}
        <div className="lg:sticky lg:top-32">
          {/* Main image */}
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-none" />

          
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col space-y-6">
          {/* Breadcrumb */}
          <div className="h-4 w-48 bg-gray-100 rounded" />

          {/* Title */}
          <div className="h-8 w-2/3 bg-gray-100 rounded" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 rounded" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-24 bg-gray-100 rounded" />
            <div className="h-5 w-16 bg-gray-100 rounded" />
          </div>

          {/* Variants */}
          <div>
            <div className="h-4 w-32 bg-gray-100 rounded mb-3" />
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-9 w-20 bg-gray-100 rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="h-12 w-full sm:w-60 bg-gray-100 rounded-lg" />

          {/* Tabs / Accordion */}
          <div className="space-y-3 mt-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-4 w-3/4 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
