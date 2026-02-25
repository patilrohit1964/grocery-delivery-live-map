import { Send } from "lucide-react";
import React from "react";
interface IProps {
  orderId: string;
  deliveryBoyId: string;
}
const DeliveryChat = ({orderId,deliveryBoyId}:IProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col">
      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          placeholder="type message..."
        />
        <button className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;
