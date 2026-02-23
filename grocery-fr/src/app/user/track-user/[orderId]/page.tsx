"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";
import { ILocation } from "@/components/DeliveryBoyDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/lib/socket";
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
export default function TrackOrder() {
  const { orderId } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<IOrder>();
  const [userLocation, setUserLocation] = useState<ILocation>({
    longitude: 0,
    latitude: 0,
  });
  // ordering must be longitude first and latitude second
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    longitude: 0,
    latitude: 0,
  });
  useEffect(() => {
    if (!orderId) return;
    const fetchOrderDetails = async () => {
      const { data } = await axios.get(`/api/user/get-order/${orderId}`);
      setOrder(data.data);
      // ordering must be longitude first and latitude second
      setUserLocation({
        longitude: data?.data?.address?.longitude,
        latitude: data?.data?.address?.latitude,
      });
      // ordering must be longitude first and latitude second
      setDeliveryBoyLocation({
        longitude: data?.data?.assignDeliveryBoy?.location?.coordinates[0],
        latitude: data?.data?.assignDeliveryBoy?.location?.coordinates[1],
      });
    };

    fetchOrderDetails();
  }, [orderId]);
  useEffect((): any => {
    const socket = getSocket();
    // update delivery boy live location with socket
    socket.on("update-deliveryBoy-location", (data) => {
      console.log(data,'data scoket')
      setDeliveryBoyLocation({
        longitude: data.location.coordinates[0],
        latitude: data.location.coordinates[1],
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, [order]);
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999">
          <Link href={"/user/my-orders"}>
            <button className="p-2 bg-green-100 transition hover:bg-green-200 rounded-full cursor-pointer">
              <ArrowLeft className="text-green-700" size={20} />
            </button>
          </Link>
          <div>
            <h2 className="text-xl font-bold">Track Order</h2>
            <p className="text-sm text-gray-600">
              order#{order?._id?.toString().slice(-6)}{" "}
              <span className="text-green-700 font-semibold">
                {order?.status}
              </span>
            </p>
          </div>
        </div>
        <div className="px-4 mt-6">
          <div className="rounded-3xl overflow-hidden border shadow">
            <LiveMap
              userLocation={userLocation}
              deliveryLocation={deliveryBoyLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
