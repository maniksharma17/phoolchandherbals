"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cancelOrder, getOrderById } from "@/utils/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Clock, Truck, PackageX, Check } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id as string);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      const res = await cancelOrder(id as string);
      setMessage("Order cancelled successfully");
      const fetchOrder = async () => {
        try {
          const data = await getOrderById(id as string);
          setOrder(data);
        } catch (err) {
          console.error("Failed to fetch order", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } catch (e) {
      console.log(e);
      setMessage("Something went wrong. Could not cancel order.");
    }
  };

  if (loading) return <p className="pt-36 text-center">Loading order...</p>;
  if (!order)
    return <p className="pt-36 text-center text-red-600">Order not found</p>;

  // Render order status like confirmation page
  const renderStatus = () => {
    switch (order.orderStatus) {
      case "pending":
        return (
          <div className="flex flex-col items-center text-yellow-600 mb-6">
            <Clock className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order is pending confirmation.</p>
          </div>
        );
      case "processing":
        return (
          <div className="flex flex-col items-center text-blue-600 mb-6">
            <Truck className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order is being processed.</p>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex flex-col items-center text-green-600 mb-6">
            <Check className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order has been been confirmed.</p>
          </div>
        );
      case "shipped":
        return (
          <div className="flex flex-col items-center text-indigo-600 mb-6">
            <Truck className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order has been shipped!</p>
          </div>
        );
      case "delivered":
        return (
          <div className="flex flex-col items-center text-green-600 mb-6">
            <CheckCircle className="h-10 w-10 mb-2" />
            <p className="font-medium">
              Your order was delivered successfully!
            </p>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex flex-col items-center text-red-600 mb-6">
            <PackageX className="h-10 w-10 mb-2" />
            <p className="font-medium">Your order was cancelled.</p>
          </div>
        );
      default:
        return <p className="text-gray-600 mb-6">Unknown status</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6"
      >
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>

        {/* Status UI */}
        {renderStatus()}

        {/* Order Info */}
        <div className="mb-6 space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Order ID:</span> {order._id}
          </p>
          <p>
            <span className="font-medium">Placed on:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Payment:</span>{" "}
            {order.paymentMethod.toUpperCase()} {" - "}
            <span
              className={
                order.paymentStatus === "paid"
                  ? "text-green-600 font-semibold uppercase"
                  : order.paymentStatus === "failed uppercase"
                  ? "text-red-600 font-semibold uppercase"
                  : "text-yellow-600 font-semibold uppercase"
              }
            >
              {order.paymentStatus}
            </span>
          </p>
          {order.shipmentInfo.etd && (
            <p>
              <span className="font-medium">Estimated Delivery:</span>{" "}
              {new Date(order.shipmentInfo.etd).toLocaleString()}
            </p>
          )}
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p>{order.customerInfo.name}</p>
            <p>{order.customerInfo.address}</p>
            <p>
              {order.customerInfo.city}, {order.customerInfo.state} -{" "}
              {order.customerInfo.zip}
            </p>
            <p>{order.customerInfo.country}</p>
            <p>Phone: {order.customerInfo.phone}</p>
            <p>Email: {order.customerInfo.email}</p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <div className="space-y-4">
            {order.products.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 border-b pb-3">
                <img
                  src={
                    process.env.NEXT_PUBLIC_AWS_URL +
                    "/" +
                    (p.variant.images?.[0] || "placeholder.png")
                  }
                  alt={p.productId?.name || "Product"}
                  className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {p.productId?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {p.variant.packSize}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                </div>
                <div className="font-semibold text-gray-900">
                  ₹{(p.variant.price * p.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{(order.totalAmount - order.shippingCost).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            {order.shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              <span>₹{order.shippingCost.toFixed(2)}</span>
            )}
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 space-x-2">
          <Link href="/orders">
            <Button variant="outline">Back to My Orders</Button>
          </Link>
          {order.orderStatus !== "cancelled" && (
            <Button
              onClick={handleCancelOrder}
              variant="ghost"
              className="border-red-600 text-red-600"
            >
              Cancel
            </Button>
          )}
          {order.shipmentInfo.trackingUrl && (
            <Link href={order.shipmentInfo.trackingUrl}>
              <Button variant="default">Track</Button>
            </Link>
          )}
        </div>
        {message && (
          <div
            className={`my-4 p-3 rounded-lg text-sm ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </motion.div>
    </div>
  );
}
