"use client";
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
type propType = {
  setStep: (s: number) => void;
};
const Welcome = ({ setStep }: propType) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-linear-to-b from-green-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.8 }}
        className="flex itece gap-3"
      >
        <ShoppingBasket className="w-10 h-10 text-green-600" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
          Snapcart
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
      >
        Your one-step destination for fresh groceries, organic produce, and
        daily essentials delivered right to your doorstep
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex items-center justify-center gap-10 mt-10"
      >
        <ShoppingBasket className="w-24 h-24 md:h-32 md:w-32 drop-shadow-md text-green-600" />
        <Bike className="w-24 h-24 md:h-32 md:w-32 drop-shadow-md text-orange-500" />
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.9, delay: 0.8 }}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 cursor-pointer mt-10"
        onClick={() => setStep(2)}
      >
        Next <ArrowRight />
      </motion.button>
    </div>
  );
};

export default Welcome;
