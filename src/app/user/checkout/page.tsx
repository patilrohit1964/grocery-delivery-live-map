"use client";
import { ArrowLeft, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const Checkout = () => {
  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 relative">
      <Link
        href={"/"}
        className="absolute -top-2 left-0 flex items-center gap-2 text-green-700 font-medium hover:bg-green-800 transition-all px-4 py-2 rounded-full shadow-md hover:shadow-lg duration-300 hover:text-white"
      >
        {/* className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all" */}
        <ArrowLeft size={20} />
        <span className="hidden md:inline">Back To Cart</span>
      </Link>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h2>
      <div className="flex justify-between items-center">
        <div className="shadow-md rounded-2xl p-4 ">
          <h3 className="flex gap-2 font-medium">
            <MapPin className="text-green-700" /> Delivery Address
          </h3>
          {/* all user details input */}
          <div>
            <div className="">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="Your Name"
              />
            </div>
            <div className="">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="Your Phone Number"
              />
            </div>
            <div className="">
              <textarea
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="Your Address"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="City"
              />
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="state"
              />
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="pincode"
              />
            </div>
            <div className="">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder=""
              />
            </div>
            <div className="">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder=""
              />
            </div>
          </div>
        </div>
        <div className="shadow-md rounded-2xl p-4 ">dd</div>
      </div>
    </div>
  );
};

export default Checkout;
