"use client";
import UserOrderCard from "@/components/UserOrderCard";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import axios from "axios";
import { ArrowLeft, PackageSearch } from "lucide-react";
import mongoose from "mongoose";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    mobile: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}
function MyOrders() {
  const [orders, setMyOrders] = useState<IOrder[]>();
  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const { data } = await axios.get("/api/user/my-orders");
        if (!data.success) {
          return toast.error(data.message || "something went wrong");
        }
        setMyOrders(data.orders);
        toast.success(data.message || "Your Orders");
      } catch (error: Error | any) {
        console.log(error, "something went wrong while fetching orders");
        return toast.error(error.message || "something went wrong");
      }
    };
    getMyOrders();
  }, []);

  // accepting live orders
  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-assigned", ({ orderId, assignDeliveryBoy }) => {
      setMyOrders((prev) =>
        prev?.map((ord) =>
          ord._id === orderId ? { ...ord, assignDeliveryBoy } : ord,
        ),
      );
    });
    return () => socket.off("order-assigned");
  }, []);
  return (
    <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
        <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
            <Link href={"/"}>
              <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full active:scale-95 transition cursor-pointer">
                <ArrowLeft size={24} className="text-green-700" />
              </button>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>
        {orders?.length === 0 ? (
          <div className="pt-20 flex flex-col items-center text-center">
            <PackageSearch size={70} className="text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Start shopping to view your orders here.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {orders?.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={idx}
              >
                <UserOrderCard order={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
