import mongoose from "mongoose";
export interface IDELIVERYASSIGNMENT {
  _id?: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  broadcastTo: mongoose.Types.ObjectId[];
  assignTo: mongoose.Types.ObjectId | null;
  status: "broadcasted" | "assigned" | "completed";
  acceptedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliveryAssignment = new mongoose.Schema<IDELIVERYASSIGNMENT>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    broadcastTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["broadcasted", "assigned", "completed"],
      default: "broadcasted",
    },
    acceptedAt: {
      type: Date,
      // required: true,
      default: null,
    },
  },
  { timestamps: true },
);

const DeliverAssignment =
  mongoose.models.DeliverAssignment ||
  mongoose.model("DeliverAssignment", deliveryAssignment);
export default DeliverAssignment;
