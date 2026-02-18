import { IOrder } from "@/models/order.model";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { getStatusColor } from "./UserOrderCard";
const statusOptions = ["pending", "out of delivery"];
function AdminOrderCard({ order }: { order: IOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<string>(order.status);
  const updateStatus = async (orderId: string, status: string) => {
    try {
      const { data } = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        { status },
      );
      console.log(data,'order data')
      if(data.success){
        setStatus(status);
      }
    } catch (error) {
      console.log(error, "error while order status update");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order?._id?.toString().slice(-6)}
          </p>
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${order?.isPaid ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-100"}`}
          >
            {order?.isPaid ? "Paid" : "Unpaid"}
          </span>
          <p>{new Date(order?.createdAt!).toLocaleString()}</p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-green-600" />
              <span>{order?.address?.fullName}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Phone size={16} className="text-green-600" />
              <span>{order?.address?.mobile}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-green-600" />
              <span>{order?.address?.fullAddress}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <CreditCard size={16} className="text-green-600" />
              <span>
                {order?.paymentMethod === "cod"
                  ? "Cash On Delivery"
                  : "Online Payment"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${getStatusColor(status)}`}
          >
            {status}
          </span>
          <select
            onChange={(e) =>
              updateStatus(order?._id?.toString()!, e.target.value)
            }
            value={status}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status?.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="border-t border-gray-400 mt-3 pt-3">
        <button
          className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition-all "
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="flex items-center gap-2 justify-center">
            <Package size={16} className="text-green-600" />
            {expanded ? "Hide Order Items" : `View ${order?.items?.length} Items`}
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
            {order?.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item?.image}
                    height={48}
                    width={48}
                    className="object-cover border border-gray-200 rounded-lg"
                    alt="product image"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item?.name} x pack
                    </p>
                    <p className="text-xs text-gray-500">
                      {item?.quantity} x {item?.unit}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">
                  ₹{Number(item?.price) * item?.quantity}
                </h3>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="border-t pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <Truck size={16} className="text-green-600" />
          Delivery:
          <span
            className={`${getStatusColor(status)} border py-1 px-3 rounded-full font-semibold`}
          >
            {status}
          </span>
        </div>
        <div>
          Total:{" "}
          <span className="text-green-600 font-bold">₹{order?.totalAmount}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminOrderCard;
