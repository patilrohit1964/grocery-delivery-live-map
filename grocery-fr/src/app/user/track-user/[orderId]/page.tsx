"use client";

import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { IUser } from "@/models/user.model";
import { ILocation } from "@/components/DeliveryBoyDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArrowLeft, Send, Sparkle } from "lucide-react";
import Link from "next/link";
import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";
interface IOrder {
  _id?: string;
  user: string;
  items: [
    {
      grocery: string;
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
  assignment?: string;
  assignDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}
export default function TrackOrder() {
  const { orderId } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<IOrder>();
  const [suggestionLoading, setSuggestionLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>();
  const [suggestions, setSuggestions] = useState([]);
  const autoScroll = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({
    longitude: 0,
    latitude: 0,
  });
  // ordering must be longitude first and latitude second
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    longitude: 0,
    latitude: 0,
  });

  // get live orders details
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

  // update delivery boy live location with socket
  useEffect((): any => {
    const socket = getSocket();
    // update delivery boy live location with socket
    socket.on("update-deliveryBoy-location", (data) => {
      setDeliveryBoyLocation({
        longitude: data.location.coordinates[0],
        latitude: data.location.coordinates[1],
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, [order]);

  // get all messages of rooms and chats
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const { data } = await axios.post(`/api/chat/messages`, {
          roomId: orderId,
        });
        if (!data.success) {
          toast.error(data.message || "error while getting message");
          return;
        }
        setMessages(data.data);
        toast.success(data.message || "error while getting message");
      } catch (error) {
        console.log(error, "whlile fetching get all messages");
      }
    };
    getAllMessages();
  }, []);

  // join room
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
    socket.on("send-message", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev!, message]);
      }
    });
    return () => {
      socket.off("send-message");
    };
  }, []);
  // send message function get live msg and show live msg
  const sendMessage = () => {
    const socket = getSocket();
    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    socket.emit("send-message", message);
    setNewMessage("");
  };

  // auto scroll when new message arrive
  useEffect(() => {
    autoScroll?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    const message = {
      roomId: orderId,
    };
    setNewMessage(e.target.value);
    const socket = getSocket();
    socket.emit("typing", message);
  };

  // generate suggestion of ai
  const handleAiSuggestions = async () => {
    setSuggestionLoading(true);
    try {
      // this help last item of js array new technic for getting last item of array
      const lastMsg = messages
        ?.filter((msg) => msg.senderId.toString() !== userData?._id!.toString())
        ?.at(-1);
      const { data } = await axios.post(`/api/chat/ai-suggestions`, {
        message: lastMsg?.text,
        role: "user",
      });
      setSuggestionLoading(false);
      setSuggestions(data.aiResData);
    } catch (error) {
      console.log(error, "error while geting ai suggestions");
      setSuggestionLoading(false);
    } finally {
      setSuggestionLoading(false);
    }
  };
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
        <div className="bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col mt-4">
          {/* ai suggestion ui */}
          <div className="border-b border-b-gray-500">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700 text-sm">
                AI Suggestions
              </span>
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer hover:bg-purple-300 transition-all duration-300"
                onClick={handleAiSuggestions}
                disabled={suggestionLoading}
              >
                {suggestionLoading ? (
                  <p className="animate-pulse cursor-wait">Generating...</p>
                ) : (
                  <>
                    <Sparkle />
                    <span>Quick Replies</span>
                  </>
                )}
              </motion.button>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {suggestionLoading ? (
                <p className="animate-pulse">Generating...</p>
              ) : (
                suggestions.length > 0 &&
                suggestions.map((op, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.92 }}
                    className="px-3 py-1 cursor-pointer text-xs bg-green-50 border border-green-200 text-green-700 rounded-full"
                    onClick={() => setNewMessage(op)}
                  >
                    {op}
                  </motion.div>
                ))
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-3 message-scroll">
            <AnimatePresence>
              {messages?.map((msg, idx) => {
                const isCurrentUser =
                  msg.senderId.toString() === userData?._id!.toString();
                return (
                  <motion.div
                    key={msg._id?.toString()}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${isCurrentUser ? "bg-green-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
                    >
                      <p>{msg.text}</p>
                      <p className="text-[10px] opacity-70 mt-1 text-right">
                        {msg.time}
                      </p>
                      <div ref={autoScroll} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="flex gap-2 mt-3 border-t pt-3">
            <input
              type="text"
              className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              placeholder="type message..."
              onChange={handleTyping}
              value={newMessage}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage}
              className={`p-3 rounded-xl text-white ${!newMessage ? "cursor-not-allowed bg-green-400" : "cursor-pointer bg-green-600 hover:bg-green-700 text-white group"}`}
            >
              <Send
                size={18}
                className="group-hover:rotate-45 transition-all duration-500"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
