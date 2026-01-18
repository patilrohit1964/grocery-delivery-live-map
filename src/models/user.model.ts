import mongoose from "mongoose";
interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  image?: string;
  role: "user" | "deliverBoy" | "admin";
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
      enum: ["user", "deliverBoy", "admin"],
      default: "user",
      // required:true
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
