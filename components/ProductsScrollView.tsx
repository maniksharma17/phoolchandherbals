import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import type { IProduct } from '@/types/index';
import { useRef } from 'react';

interface OtherProductsProps {
  products: IProduct[]; // pass some related or random products
}

export function ProductsScrollView({ products }: OtherProductsProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8; // 80% of visible area
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          Explore More Products
        </h2>

        {/* Scroll container */}
        <div className="relative">
          {/* Left Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 hidden sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Product Row */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar"
          >
            {products.map((p) => (
              <div key={p._id} className="w-64 flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 hidden sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
