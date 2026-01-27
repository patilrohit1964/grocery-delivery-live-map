"use client";
import { RootState } from "@/redux/store";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSelector } from "react-redux";

const CartPage = () => {
  const { cartData } = useSelector((state: RootState) => state.cart);
  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Link
          href={"/"}
          className="absolute -top-2 left-0 flex items-center gap-2 text-green-700 font-medium hover:bg-green-800 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="hidden md:inline">Back To Home</span>
        </Link>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
        >
          🛒 Your Shopping Cart
        </motion.h2>
        {cartData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md"
          >
            <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-3">Your cart is empty. Add some groceries to continue Shopping</p>
            <Link
              href={"/"}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium"
            >
              Continute Shopping
            </Link>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default CartPage;
