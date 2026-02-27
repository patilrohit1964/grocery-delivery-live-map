import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
interface IProps {
  orderId: string;
  deliveryBoyId: string;
}
const DeliveryChat = ({ orderId, deliveryBoyId }: IProps) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>();
  const autoScroll = useRef(null);

  // join room
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
  }, []);

  // get all messages of rooms
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
    socket.on("send-message", (message) => {
      setMessages((prev) => [...prev!, message]);
    });
    setNewMessage("");
    autoScroll?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col">
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <AnimatePresence>
          {messages?.map((msg, idx) => {
            const isCurrentUser =
              msg.senderId.toString() === deliveryBoyId.toString();
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
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
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
