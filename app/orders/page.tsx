"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrders } from "@/utils/api"; // API wrapper
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders(); 
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="pt-36 text-center">Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="pt-36 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-600">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ scale: 1.01 }}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <Link href={`/orders/${order._id}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                    <p className="text-gray-900 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()} -{" "}
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {order.products.length} item
                      {order.products.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.orderStatus === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.orderStatus === "shipped"
                        ? "bg-indigo-100 text-indigo-800"
                        : order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.orderStatus}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
