'use client'
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const CartPage = () => {
  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Link
          href={"/"}
          className="absolute -top-6 left-0 flex items-center gap-2 text-green-700 font-medium hover:bg-green-800 transition-all"
        >
          <ArrowLeft size={20}/>
          <span className="hidden md:inline">Back To Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default CartPage;
