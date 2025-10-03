"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  X,
  ShoppingCart,
  ArrowRight,
  Truck,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
  getShippingCost,
} from "@/utils/api";
import { useAuthStore } from "@/store/authStore";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const { user } = useAuthStore();

  // Fetch cart on mount
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await getCart();
      setCart(res);
      const shippingCost = await getShippingCost();
      setShippingCost(shippingCost);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = async (itemId: string, quantity: number) => {
    try {
      await updateCart(itemId, quantity);
    } catch (e) {
      console.log(e);
    } finally {
      fetchCart();
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (e) {
      console.log(e);
    } finally {
      fetchCart();
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    await clearCart();
    await fetchCart();
    setIsClearing(false);
  };

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/login?redirect=checkout");
      return;
    }
    router.push("/checkout");
  };

  if (isLoading) return <p className="pt-20 text-center">Loading...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Calculate order summary
  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + item.variant.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : shippingCost;
  const grandTotal = subtotal + shipping;

  return (
    <div className="pt-28 lg:pt-44 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl lg:text-3xl font-bold gradient-text">
              Shopping Cart
            </h1>
            {/* <Button
              variant="outline"
              onClick={handleClearCart}
              loading={isClearing}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear
            </Button> */}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <motion.div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                layout
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      process.env.NEXT_PUBLIC_AWS_URL +
                      "/" +
                      item.variant.images[0]
                    }
                    alt={item.productId.name}
                    className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.productId.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Size: {item.variant.packSize}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex flex-row items-start justify-flex-start mt-4">
                      <div className="w-fit justify-between flex flex-row items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-gray-100"
                            onClick={() =>
                              handleUpdate(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-0 py-2 font-semibold min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-gray-100"
                            onClick={() =>
                              handleUpdate(item._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-lg max-sm:text-md font-medium text-gray-900">
                          ₹{(item.variant.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items):</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Shipping:
                </span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {user ? (
              <Button
                onClick={handleCheckout}
                className="w-full mb-4"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={handleCheckout}
                className="w-full mb-4"
                size="lg"
              >
                Sign in to Checkout
                <User className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Link href="/products">
              <Button variant="secondary" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
