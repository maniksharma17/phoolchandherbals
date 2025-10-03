'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ICart, ICartItem } from '@/types/index';
import { useEffect, useState } from 'react';
import { getCart, getShippingCost, removeFromCart, updateCart } from '@/utils/api';
import { useCartStore } from '@/store/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<ICart>();
  const [items, setItems] = useState<ICartItem[]>();
  const [shippingCost, setShippingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {fetchCart: fc} = useCartStore();

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await getCart(); 
      setCart(res);
      setItems(res.items);

      const shippingCost = await getShippingCost();
      setShippingCost(shippingCost);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setIsLoading(false);
      fc();
    }
  };

  // Fetch cart whenever drawer opens
  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);
  
  const handleCheckout = () => {
    onClose();
    router.push('/cart');
  };

  const handleUpdate = async (itemId: string, quantity: number) => {
    try {
      await updateCart(itemId, quantity);
    } catch(e) {
      console.log(e);
    } finally {
      fetchCart();
      fc();
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch(e) {
      console.log(e);
    } finally {
      fetchCart();
      fc();
    }
  }

  let total = 0;
  let subTotal = 0;
  
  if (cart) { 
    subTotal = cart?.totalAmount;
    const shipping = subTotal > 500 ? 0 : shippingCost;
    total = subTotal + shipping; 
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Add some products to get started
                    </p>
                    <Button onClick={onClose}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items?.map((item: ICartItem) => (
                      <motion.div
                        key={item._id}
                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                        layout
                      >
                        <img
                          src={process.env.NEXT_PUBLIC_AWS_URL+'/'+item.variant.images[0] || '/placeholder-product.jpg'}
                          alt={item.productId.name}
                          className="w-16 h-16 object-cover rounded-md bg-gray-100"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {item.productId.name}
                          </h4>
                          {item.variant && (
                            <p className="text-xs text-gray-500">
                              Size: {item.variant.packSize}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-gray-900">
                              ₹{item.variant.price * item.quantity}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={item.quantity===1}
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  if(item.quantity===1) return;
                                  handleUpdate(item._id, item.quantity-1)
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="text-sm font-medium min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  handleUpdate(item._id, item.quantity+1)
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                onClick={() => {
                                  handleDelete(item._id)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items && items?.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{cart?.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{subTotal > 500 ? "Free" : `₹${shippingCost}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
