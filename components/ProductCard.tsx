'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import type { IProduct, IVariant } from '@/types/index';
import Image from 'next/image';
import { addToCart } from '@/utils/api';
import { useSnack } from './Snack';
import { useCart } from '@/hooks/use-cart';

const AWS = process.env.NEXT_PUBLIC_AWS_URL;

interface ProductCardProps {
  product: IProduct;
}

type AddItemPayload = {
  productId: string;
  variantId?: string | null;
  quantity?: number;
  price?: number;
  title?: string;
  image?: string | null;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { showSnack } = useSnack();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(
    (product.variants && product.variants.length > 0) ? product.variants[0] : null
  );
  const { fetchCart } = useCartStore();


  const minPrice = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((v) => v.price));
  }, [product.variants]);

  const maxPrice = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.max(...product.variants.map((v) => v.price));
  }, [product.variants]);

  const currentPrice = selectedVariant?.price ?? minPrice;
  const currentImage = selectedVariant?.images?.[0] ?? product.baseImages?.[0] ?? '/placeholder-product.jpg';
  const imageSrc = (currentImage && (currentImage.startsWith('http') || currentImage.startsWith('/')))
    ? currentImage
    : (AWS ? `${AWS}/${currentImage}` : currentImage);

  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = {
      productId: product._id,
      variant: selectedVariant?._id ?? null,
      quantity: 1,
    };

    try {
      addToCart(payload.productId, payload.quantity, payload.variant as string);
      showSnack('Product added to cart', 'success');
    } catch (err) {
      console.log(err);
      showSnack('Something went wrong!', 'error');
    } finally {
      fetchCart()
    }
  };

  const handleVariantSelect = (variantId: string) => {
    const v = product.variants?.find((x) => x._id === variantId) ?? null;
    setSelectedVariant(v);
  };

  return (
    <motion.div
      className="group bg-white transition-all duration-300 overflow-hidden max-sm:border max-sm:border-gray-100"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}?name=${product.name}`} aria-label={`View ${product.name}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            width={400}
            height={400}
            src={imageSrc}
            alt={product.name}
            className="scale-125 w-full h-full object-cover transition-transform duration-300"
          />

          {/* Overlay actions */}
          <motion.div
            className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            aria-hidden={!isHovered}
          >
          </motion.div>

          {/* Sale badge */}
          {selectedVariant && selectedVariant.cutoffPrice && selectedVariant.price < selectedVariant.cutoffPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              SALE
            </div>
          )}

          {/* OOS overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="text-sm font-semibold text-gray-700">Out of stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 max-sm:h-12 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Variants -> horizontal scroll on small screens, wrap on larger */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <div
              role="list"
              aria-label="Product variants (scroll horizontally)"
              className="flex gap-2 overflow-x-auto py-1 px-0 -mx-0 sm:overflow-visible sm:flex-wrap"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {product.variants.map((variant) => {
                const active = selectedVariant?._id === variant._id;
                return (
                  <button
                    key={variant._id}
                    type="button"
                    onClick={() => handleVariantSelect(variant._id)}
                    className={`text-xs px-3 py-1 rounded-md border transition-colors flex-shrink-0 whitespace-nowrap min-w-max
                      ${active
                        ? 'bg-primary text-gray-900 border-primary'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}
                    `}
                    aria-pressed={active}
                    aria-label={`Choose ${variant.packSize}`}
                  >
                    {variant.packSize}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price + Add button
            - On mobile: column layout -> Add button moved down and full width
            - On sm+: row layout -> price & add button inline
        */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">₹{currentPrice}</span>
              {selectedVariant?.cutoffPrice && selectedVariant.cutoffPrice !== currentPrice && (
                <span className="text-sm font-light line-through text-gray-500">₹{selectedVariant.cutoffPrice}</span>
              )}
            </div>
            {/* Optionally show pack size or small meta */}
            {selectedVariant?.packSize && (
              <span className="text-xs text-gray-500 mt-1">{selectedVariant.packSize}</span>
            )}
          </div>

          <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-auto">
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={isOutOfStock}
              className="flex items-center gap-2 justify-center w-full sm:w-auto disabled:opacity-60"
              aria-disabled={isOutOfStock}
              aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? 'Out' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
}
