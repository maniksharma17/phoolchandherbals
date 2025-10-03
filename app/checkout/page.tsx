"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import {
  getCart,
  createOrder,
  createPayment,
  verifyPayment,
  getShippingCost,
} from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [cart, setCart] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutForm>();

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res);
      const shippingCost = await getShippingCost();
      setShippingCost(shippingCost);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      router.push("/cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user, setValue]);

  const onSubmit = async (formData: CheckoutForm) => {
    if (!cart) return;
    setIsProcessing(true);

    try {
      const subtotal = cart.items.reduce(
        (sum: number, item: any) => sum + item.variant.price * item.quantity,
        0
      );

      // Create order
      const orderData = {
        products: cart.items.map((item: any) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          variant: item.variant._id,
          price: item.variant.price,
        })),
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
        },
        paymentMethod: paymentMethod,
      };

      const order = await createOrder(orderData);

      if (paymentMethod === "cod") {
        router.push(`/order-confirmation?order=${order._id}`);
        return;
      }

      // Create Razorpay payment
      const paymentResponse = await createPayment(order._id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        name: "Phoolchand Herbals Pvt Ltd",
        description: "Order Payment",
        order_id: paymentResponse.id,
        handler: async (response: any) => {
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order._id,
            });

            if (verification.success) {
              router.push(`/order-confirmation?order=${order._id}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#c3f274" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error processing order. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart) return <p className="pt-20 text-center">Loading...</p>;

  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + item.variant.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : shippingCost;
  const grandTotal = subtotal + shipping;

  return (
    <div className="pt-28 lg:pt-36 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/cart"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold gradient-text">Checkout</h1>
        </motion.div>

        <div className="flex flex-col-reverse lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-gray-900" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...register("firstName", { required: true })}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...register("lastName", { required: true })}
                    error={errors.lastName?.message}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  {...register("email", { required: true })}
                  error={errors.email?.message}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  {...register("phone", { required: true })}
                  error={errors.phone?.message}
                />
                <Input
                  label="Address"
                  {...register("address", { required: true })}
                  error={errors.address?.message}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    {...register("city", { required: true })}
                    error={errors.city?.message}
                  />
                  <Input
                    label="State"
                    {...register("state", { required: true })}
                    error={errors.state?.message}
                  />
                  <Input
                    label="ZIP Code"
                    {...register("zipCode", { required: true })}
                    error={errors.zipCode?.message}
                  />
                </div>

                {/* Payment Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-gray-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Method
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center gap-3">
                    <img
                      src="https://razorpay.com/assets/razorpay-logo.svg"
                      alt="Razorpay"
                      className="h-6"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Secure Payment by Razorpay
                      </p>
                      <p className="text-sm text-gray-600">
                        Pay securely using Credit Card, Debit Card, Net Banking,
                        UPI & more
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setPaymentMethod("razorpay")}
                    type="submit"
                    loading={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    Pay ₹{grandTotal.toFixed(2)}
                  </Button>
                </div>

                <div className="flex flex-row items-center gap-2 w-full">
                  <div className="h-1 border-t w-full"></div>
                  <div className="text-gray-500 font-light">OR</div>
                  <div className="h-1 border-t w-full"></div>
                </div>

                <div>
                  <Button
                    onClick={() => setPaymentMethod("cod")}
                    type="submit"
                    loading={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    Pay on Delivery
                  </Button>
                </div>
              </form>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Secure Checkout
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> SSL encrypted
                  secure checkout
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> Your payment
                  information is protected
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> Trusted by
                  thousands of happy customers
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:sticky lg:top-24 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item: any) => (
                  <div
                    key={`${item.productId._id}-${item.variant._id}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={
                        process.env.NEXT_PUBLIC_AWS_URL +
                        "/" +
                        item.variant.images[0]
                      }
                      alt={item.productId.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {item.productId.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Size: {item.variant.packSize}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{item.variant.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>₹{shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
