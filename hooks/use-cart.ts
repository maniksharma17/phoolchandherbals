'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCart } from '@/utils/api'; // API call to fetch cart

export const useCart = () => {
  const [cart, setCart] = useState<{ items: any[]; totalAmount: number }>({ items: [], totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCart(); 
      setCart(response);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { cart, fetchCart, isLoading };
};
