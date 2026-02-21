import mongoose from "mongoose";
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  image?: string;
  role: "user" | "deliveryBoy" | "admin";
  location?: {
    type: {
      type: string;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: number[];
      default: number[];
    };
  };
  socketId: null | string;
  isOnline: boolean;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    mobile: {
      type: String,
      // required:true
    },
    image: {
      type: String,
      // required:true
    },
    role: {
      type: String,
      enum: ["user", "deliveryBoy", "admin"],
      default: "user",
      // required:true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
// for location tracking
userSchema.index({ location: "2dsphere" });
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
