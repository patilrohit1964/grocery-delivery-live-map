import mongoose from "mongoose";

export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  text: string;
  senderId: mongoose.Types.ObjectId;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messsageSchema = new mongoose.Schema<IMessage>(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: String,
    },
  },
  { timestamps: true },
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messsageSchema);
export default Message;
