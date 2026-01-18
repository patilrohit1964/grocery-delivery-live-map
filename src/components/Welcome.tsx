"use client";
import { ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 1 }}
        className="flex itece gap-3"
      >
        <ShoppingBasket className="w-10 h-10 text-green-600" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
          Snapcart
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 1 }}
      >
        Your one-step destination for fresh groceries, organic produce, and daily essentials delivered right to your doorstep
      </motion.p>
    </div>
  );
};

export default Welcome;
