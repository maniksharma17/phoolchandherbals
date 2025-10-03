"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Clock, Truck, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/utils/api"; // your API wrapper

export default function OrderConfirmationPage() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <p className="pt-36 text-center">Loading order...</p>;
  }

  if (!order) {
    return <p className="pt-36 text-center text-red-600">Order not found</p>;
  }

  // Status UI
  const renderStatus = () => {
    switch (order.orderStatus) {
      case "pending":
        return (
          <div className="flex flex-col items-center text-yellow-600">
            <Clock className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order is pending confirmation.</p>
          </div>
        );
      case "processing":
        return (
          <div className="flex flex-col items-center text-blue-600">
            <Truck className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order is being processed.</p>
          </div>
        );
        case "confirmed":
        return (
          <div className="flex flex-col items-center text-green-600">
            <CheckCircle className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order has been confirmed!</p>
          </div>
        );
      case "shipped":
        return (
          <div className="flex flex-col items-center text-indigo-600">
            <Truck className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order has been shipped!</p>
          </div>
        );
      case "delivered":
        return (
          <div className="flex flex-col items-center text-green-600">
            <CheckCircle className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order was delivered successfully!</p>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex flex-col items-center text-red-600">
            <PackageX className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order was cancelled.</p>
          </div>
        );
      default:
        return <p className="text-gray-600">Unknown status</p>;
    }
  };

  return (
    <div className="min-h-screen bg-primary pt-36 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Thank you for your order!
        </h1>

        {/* Status */}
        <div className="mb-6">{renderStatus()}</div>

        {/* Order Details */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Order ID:</span> {order._id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Placed on:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Payment Method:</span>{" "}
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Razorpay / Online Payment"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Payment Status:</span>{" "}
            <span
              className={
                order.paymentStatus === "paid"
                  ? "text-green-600 font-semibold"
                  : order.paymentStatus === "failed"
                  ? "text-red-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }
            >
              {order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)}
            </span>
          </p>

          <div className="pt-4">
            <h2 className="font-semibold text-gray-900 mb-2">Items:</h2>
            <div className="space-y-3">
              {order.products.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{p.productId.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.variant.packSize} × {p.quantity}
                    </p>
                  </div>
                  <span className="text-gray-900 font-medium">
                    ₹{(p.variant.price * p.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₹{(order.totalAmount - order.shippingCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              {order.shippingCost === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <span>₹{order.shippingCost.toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link href="/products" className="w-full">
            <Button className="w-full" size="lg" variant="outline">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/orders" className="w-full">
            <Button className="w-full" size="lg" variant="default">
              View My Orders
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
