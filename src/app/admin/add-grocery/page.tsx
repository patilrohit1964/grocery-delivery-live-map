"use client";
import { ArrowLeft, ChevronDownIcon, PlusCircleIcon } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
const groceryCategories = [
  "fruits & vegetables",
  "dairy & eggs",
  "rice,atta & grains",
  "snaks & biscuits",
  "spices & masalas",
  "beverages & drinks",
  "personal care",
  "household essentials",
  "instant & packaged food",
  "baby & pet care",
];
const AddGrocery = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 relative">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Link href={"/"}>
          <button className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all">
            <ArrowLeft className="w-5 h-5" />{" "}
            <span className="hidden md:flex">Back To Home</span>
          </button>
        </Link>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex  items-center gap-3">
            <PlusCircleIcon className="w-5 h-5  text-green-600" />
            <h1>Add Your Grocery</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Fill out the details below to add new grocery items.
          </p>
        </div>
        <form className="flex flex-col gap-6 w-full">
<div>
    <label htmlFor="">Grocery Name</label>
</div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
