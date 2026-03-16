"use client";
import {
  ArrowLeft,
  ChevronDownIcon,
  CloudCog,
  Loader2,
  PlusCircleIcon,
  Upload,
} from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
export const groceryCategories = [
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
const units = ["kg", "g", "litre", "ml", "piece", "pack"];
const AddGrocery = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    unit: string;
    price: string;
    image: File | null;
  }>({
    name: "",
    category: "",
    unit: "",
    price: "",
    image: null,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddGrocery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let addGroceryFormData = new FormData();
      if (formData.image) {
        addGroceryFormData.append("image", formData.image);
      }
      addGroceryFormData.append("name", formData.name);
      addGroceryFormData.append("category", formData.category);
      addGroceryFormData.append("unit", formData.unit);
      addGroceryFormData.append("price", formData.price);
      const response = await axios.post(
        "/api/admin/add-grocery",
        addGroceryFormData,
      );
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        setFormData({
          name: "",
          category: "",
          unit: "",
          price: "",
          image: null,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 relative px-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Link
          href={"/"}
          className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all"
        >
          <ArrowLeft />
          <span className="hidden md:flex">Back To Home</span>
        </Link>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 md:p-8 p-4 md:mt-0 mt-4"
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
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleAddGrocery}
        >
          <div>
            <label
              htmlFor="grocery-name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="grocery-name"
              placeholder="eg:sweets,milk..."
              className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="grocery-category"
                className="block text-gray-700 font-medium mb-1"
              >
                Grocery Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all bg-white cursor-pointer"
                id="grocery-category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value={""} selected>
                  Select Grocery Category
                </option>
                {groceryCategories.map((category, idx) => (
                  <option key={idx} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="grocery-unit"
                className="block text-gray-700 font-medium mb-1"
              >
                Grocery Unit <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all bg-white cursor-pointer"
                id="grocery-unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              >
                <option value={""} selected>
                  Select Grocery Category
                </option>
                {units.map((unit, idx) => (
                  <option key={idx} value={unit} className="capitalize">
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="grocery-price"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="grocery-price"
              placeholder="Enter Grocery Price"
              className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label
              htmlFor="grocery-image"
              className="cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto"
            >
              <Upload className="w-5 h-5" /> Upload Grocery Image
            </label>
            <input
              type="file"
              accept="image/*"
              id="grocery-image"
              hidden
              onChange={handleImageChange}
            />
            {preview && (
              <div className="mt-2">
                <Image
                  src={preview}
                  width={100}
                  height={100}
                  alt="preview"
                  className="rounded-xl shadow-md border border-gray-200 object-cover"
                />
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-linear-to-r from-green-500 to bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Adding...
              </>
            ) : (
              "Add Grocery"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
