import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
interface IProps {
  orderId: string;
  deliveryBoyId: string;
}
const DeliveryChat = ({ orderId, deliveryBoyId }: IProps) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>();
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
  }, []);

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const { data } = await axios.post(`/api/chat/messages`, {
          roomId: orderId,
        });
        console.log(data, "data");
        if (!data.success) {
          toast.error(data.message || "error while getting message");
          return;
        }
      } catch (error) {
        console.log(error, "whlile fetching get all messages");
      }
    };
    getAllMessages();
  }, []);
  const sendMessage = () => {
    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    const socket = getSocket();
    socket.emit("send-message", message);
    setNewMessage("");
  };
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col">
      <AnimatePresence>
        {messages?.map((msg, idx) => (
          <motion.div
            key={msg._id?.toString()}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className=""
          ></motion.div>
        ))}
      </AnimatePresence>
      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          placeholder="type message..."
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white group cursor-pointer"
        >
          <Send
            size={18}
            className="group-hover:rotate-45 transition-all duration-500"
          />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;
