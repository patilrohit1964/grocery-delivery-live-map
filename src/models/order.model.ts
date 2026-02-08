import mongoose from "mongoose";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
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
  assignment?: mongoose.Types.ObjectId;
  assignDeliveryBoy?: mongoose.Types.ObjectId;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}
const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        grocery: {
          type: mongoose.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      fullName: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      fullAddress: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    assignment: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignDeliveryBoy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "out of delivery", "delivered"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
