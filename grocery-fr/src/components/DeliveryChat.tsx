import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Send, Sparkle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
interface IProps {
  orderId: string;
  deliveryBoyId: string;
}
const DeliveryChat = ({ orderId, deliveryBoyId }: IProps) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>();
  const [suggestions, setSuggestions] = useState([
    "hello",
    "how are you",
    "thank you",
  ]);
  const autoScroll = useRef<HTMLDivElement>(null);

  // join room
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
  }, []);

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

  // send message function get live msg and show live msg
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

  // generate suggestion
  const handleAiSuggestions = async () => {
    try {
      // this help last item of js array new technic for getting last item of array
      const lastMsg = messages?.at(-1);
      const { data } = await axios.post(`/api/chat/ai-suggestions`, {
        message: newMessage,
        role: "deliveryBoy",
      });
      const aiRes = data.aiRes.candidates[0].content.parts[0].text;
    } catch (error) {
      console.log(error, "error while geting ai suggestions");
    }
  };
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700 text-sm">
          AI Suggestions
        </span>
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer hover:bg-purple-300 transition-all duration-300"
          onClick={handleAiSuggestions}
        >
          <Sparkle />
          Quick Replies
        </motion.button>
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        {suggestions.map((op, idx) => (
          <motion.div
            key={idx}
            whileTap={{ scale: 0.92 }}
            className="px-3 py-1 cursor-pointer text-xs bg-green-50 border border-green-200 text-green-700 rounded-full"
            onClick={() => setNewMessage(op)}
          >
            {op}
          </motion.div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-3 message-scroll">
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
          onChange={handleTyping}
          value={newMessage}
        />
        <button
          onClick={sendMessage}
          className={`p-3 rounded-xl text-white ${!newMessage ? "cursor-not-allowed bg-green-400" : "cursor-pointer bg-green-600 hover:bg-green-700 text-white group"}`}
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
