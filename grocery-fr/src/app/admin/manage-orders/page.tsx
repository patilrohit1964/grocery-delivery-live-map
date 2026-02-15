"use client";
import AdminOrderCard from "@/components/AdminOrderCard";
import { getSocket } from "@/lib/socket";
import { IOrder } from "@/models/order.model";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ManageOrders() {
  const [myOrders, setMyOrders] = useState<IOrder[]>();
  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const { data } = await axios.get("/api/admin/get-orders");
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
  useEffect((): any => {
    const socket = getSocket();
    socket?.on("new-order", (newOrder) => {
      console.log(newOrder, "new order");
      setMyOrders((prev) => [newOrder, ...prev!]);
    });
    return () => socket.off("new-order");
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
        <Link href={"/"}>
          <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full active:scale-95 transition cursor-pointer">
            <ArrowLeft size={24} className="text-green-700" />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-16 space-y-8">
        <div className="space-y-6">
          {myOrders?.map((item, idx) => (
            <AdminOrderCard order={item} key={item._id?.toString()} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
