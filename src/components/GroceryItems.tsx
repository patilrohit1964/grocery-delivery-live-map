"use client";
import {
  addToCart,
  calculateTotals,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import mongoose from "mongoose";
import { motion } from "motion/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

interface IGroceryItem {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const GroceryItems = ({ groceryItem }: { groceryItem: IGroceryItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const handleCartData = () => {
    dispatch(addToCart({ ...groceryItem, quantity: 1 }));
    dispatch(calculateTotals());
  };
  const cartItemExist = cartData.find((cart) => cart._id === groceryItem._id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6 }}
      viewport={{ once: false, amount: 0.3 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden group">
        <Image
          src={groceryItem.image}
          fill
          alt="grocery image"
          sizes="(max-width:768px) 100vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 font-medium mb-1">
          {groceryItem.category}
        </p>
        <h3 className="">{groceryItem.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 py-1 rounded-full">
            {groceryItem.unit}
          </span>
          <span className="font-bold text-green-700 text-lg">
            ₹{groceryItem.price}
          </span>
        </div>
        {cartItemExist ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-full py-2 px-4 gap-4"
          >
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer border border-gray-400"
              onClick={() => dispatch(decreaseQuantity(groceryItem._id))}
            >
              <Minus size={16} className="text-green-700" />
            </button>
            <span>{cartItemExist.quantity}</span>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer border border-gray-400"
              onClick={() => dispatch(increaseQuantity(groceryItem._id))}
            >
              <Plus size={16} className="text-green-700" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleCartData}
            whileTap={{ scale: 0.96 }}
            className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-2 text-sm font-medium transition-all cursor-pointer duration-300"
          >
            <ShoppingCart className="w-5 h-5" /> Add To Cart
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default GroceryItems;
