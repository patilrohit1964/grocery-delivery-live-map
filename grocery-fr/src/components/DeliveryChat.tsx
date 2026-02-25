import { getSocket } from "@/lib/socket";
import { Send } from "lucide-react";
import React, { useEffect } from "react";
interface IProps {
  orderId: string;
  deliveryBoyId: string;
}
const DeliveryChat = ({ orderId, deliveryBoyId }: IProps) => {
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
  }, []);
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col">
      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          placeholder="type message..."
        />
        <button className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white group cursor-pointer">
          <Send size={18} className="group-hover:rotate-45 transition-all duration-500" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;
