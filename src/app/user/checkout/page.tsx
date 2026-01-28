"use client";
import { ArrowLeft } from "lucide-react";
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
      <motion.div className="shadow-md rounded-2xl p-4">
        
      </motion.div>
    </div>
  );
};

export default Checkout;
