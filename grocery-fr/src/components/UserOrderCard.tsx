import { IUser } from "@/models/user.model";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
  UserCheck2,
} from "lucide-react";
import mongoose from "mongoose";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "delivered":
      return "bg-green-100 text-green-700 border-green-300";
    case "out of delivery":
      return "bg-blue-100 text-blue-700 border-blue-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};
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
function UserOrderCard({ order }: { order: IOrder }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-200 px-5 py-4 bg-linear-to-r from-green-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order:{" "}
            <span className="text-green-700 font-bold">
              #{order._id?.toString()?.slice(-6)}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order?.createdAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full font-semibold text-xs border ${order.isPaid ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {order.paymentMethod === "cod" ? (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16} className="text-green-600" />
            Cash On Delivery
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <CreditCard size={16} className="text-green-600" />
            Online Payment
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin size={16} className="text-green-600" />
          <span className="trucate">{order.address.fullAddress}</span>
        </div>
        <div className="border-t border-gray-400 pt-3">
          <button
            className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition-all "
            onClick={() => setExpanded((prev) => !prev)}
          >
            <span className="flex items-center gap-2 justify-center">
              <Package size={16} className="text-green-600" />
              {expanded
                ? "Hide Order Items"
                : `View ${order.items.length} Items`}
            </span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      height={48}
                      width={48}
                      className="object-cover border border-gray-200 rounded-lg"
                      alt="product image"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.name} x pack
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {item.unit}
                      </p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">
                    ₹{Number(item.price) * item.quantity}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16} className="text-green-600" />
            Delivery:
            <span
              className={`${getStatusColor(order.status)} border py-1 px-3 rounded-full font-semibold`}
            >
              {order.status}
            </span>
          </div>
          <div>
            Total:{" "}
            <span className="text-green-600 font-bold">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>
        {order?.assignDeliveryBoy && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <UserCheck2 className="text-blue-600" size={18} />
              <div className="font-semibold text-gray-800">
                <p>
                  Assigned To:{" "}
                  <span>
                    {order?.assignDeliveryBoy?.name.charAt(0).toUpperCase() +
                      order.assignDeliveryBoy.name.slice(1)}
                  </span>
                </p>
                <p className="text-xs text-gray-600">
                  📞 :<span>{order?.assignDeliveryBoy?.mobile}</span>
                </p>
              </div>
            </div>
            <a
              href={`tel:${order.assignDeliveryBoy.mobile}`}
              className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              Call
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default UserOrderCard;
