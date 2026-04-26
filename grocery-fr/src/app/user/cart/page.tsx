"use client";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Link
          href={"/"}
          className="absolute -top-2 left-0 flex items-center gap-2 text-green-700 font-medium hover:bg-green-800 transition-all px-4 py-2 rounded-full shadow-md hover:shadow-lg duration-300 hover:text-white"
        >
          {/* className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all" */}
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
            <p className="text-sm text-gray-500 mb-3">
              Your cart is empty. Add some groceries to continue Shopping
            </p>
            <Link
              href={"/"}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium"
            >
              Continute Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <AnimatePresence>
                {cartData.map((cart, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                      <Image
                        src={cart.image}
                        alt={cart.name}
                        fill
                        className="object-contain p-3 transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                        {cart.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {cart.unit}
                      </p>
                      <p className="text-green-700 font-bold mt-1 text-sm sm:text-base">
                        ₹{Number(cart.price) * cart.quantity}
                      </p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-3 mt-3 sm:mt-0 bg-gray-50 px-3 py-2 rounded-full border border-gray-300">
                      <button
                        className="bg-white p-1.5 rounded-full hover:bg-green-100 transition-all border border-gray-200 cursor-pointer"
                        onClick={() => {
                          dispatch(decreaseQuantity(cart._id));
                        }}
                      >
                        <Minus size={16} className="text-green-700" />
                      </button>
                      <span>{cart.quantity}</span>
                      <button
                        className="bg-white p-1.5 rounded-full hover:bg-green-100 transition-all border border-gray-200 cursor-pointer"
                        onClick={() => {
                          dispatch(increaseQuantity(cart._id));
                        }}
                      >
                        <Plus size={16} className="text-green-700" />
                      </button>
                    </div>
                    <button
                      className="sm:ml-4 mt-3 sm:mt-0 text-red-500 hover:text-red-700 transition-all cursor-pointer"
                      onClick={() => {
                        dispatch(removeFromCart(cart._id));
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-green-700">
                      ₹{subTotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold text-green-700">
                      ₹{deliveryFee}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-lg sm:text-xl">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-green-700">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>
                <Link href={'/user/checkout'}>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    // onClick={handleCheckout}
                    disabled={cartData.length === 0}
                    className={`w-full mt-4 py-3 px-4 rounded-full font-medium transition-all cursor-pointer ${
                      cartData.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;
