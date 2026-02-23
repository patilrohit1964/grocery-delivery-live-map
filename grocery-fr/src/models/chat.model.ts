import mongoose, { model } from "mongoose";
interface IChatRoom {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatRoomSchema = new mongoose.Schema<IChatRoom>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryBoyId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true },
);

const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
