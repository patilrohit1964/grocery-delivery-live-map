"use client";
import { IGROCERY } from "@/models/grocery.model";
import axios from "axios";
import {
  ArrowLeft,
  Delete,
  Package,
  Pencil,
  Search,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { groceryCategories, units } from "../add-grocery/page";

const ViewGroceries = () => {
  const [groceries, setGroceries] = useState<IGROCERY[]>([]);
  const router = useRouter();
  const [editGrocery, setEditGrocery] = useState<IGROCERY | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImg, setBackendImg] = useState<string | null>(null);

  useEffect(() => {
    async function getGroceries() {
      try {
        const { data: getGrocery } = await axios.get(
          "/api/admin/get-groceries",
        );
        if (!getGrocery?.success) {
          return toast.error(
            getGrocery?.success || "error while geting groceries",
          );
        }
        setGroceries(getGrocery?.data);
      } catch (error) {
        console.log(error, "error while geting groceries");
      }
    }
    getGroceries();
  }, []);
  const handleEditGrocery = async () => {
    try {
      const formData = new FormData();
      formData.append("_id",editGrocery._id);
      formData.append("name",editGrocery.name);
      formData.append("category",editGrocery?.category);
      formData.append("price",editGrocery?.price);
      formData.append("unit",editGrocery?.unit);
      formData.append("image"imagePreview);
      const { data: editRes } = await axios.put(
        "/api/admin/edit-grocery",
        formData,
      );
      console.log(editRes, "edit res");
    } catch (error) {
      console.log(error, "error while edit grocery");
    }
    console.log(editGrocery, "grocer value");
  };
  useEffect(() => {
    if (editGrocery) {
      setImagePreview(editGrocery?.image);
    }
  }, [editGrocery]);
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left py-4"
      >
        <button
          className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
          <Package className="text-green-600" /> Mange Groceries
        </h1>
      </motion.div>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
      >
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
          placeholder="Search groceries"
        />
      </motion.form>
      <div className="space-y-4">
        {groceries.map((grocery, idx) => (
          <motion.div
            key={grocery?._id?.toString()}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
          >
            <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={grocery?.image}
                alt={grocery?.name}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {grocery?.name}
                </h3>
                <p className="text-gray-500 text-sm capitalize">
                  {grocery?.category}
                </p>
              </div>
              <div className="mt-3 flex sm:items-center flex-col sm:justify-between gap-2 sm:flex-row">
                <p className="text-green-700 font-bold text-lg">
                  ₹{grocery?.price}/{" "}
                  <span className="text-gray-500 text-sm font-medium ml-1">
                    {grocery?.unit}
                  </span>
                </p>
                <button
                  onClick={() => setEditGrocery(grocery)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {editGrocery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">
                  Edit Grocery
                </h2>
                <button
                  className="text-gray-600 hover:text-white transition-all duration-300 hover:bg-gray-500 rounded-xl p-1 cursor-pointer"
                  onClick={() => setEditGrocery(null)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative aspect-square w-32 h-32 m-auto rounded-lg overflow-hidden mb-4 border border-gray-200 group">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={editGrocery?.name}
                    fill
                    className="object-cover"
                  />
                )}
                <label
                  htmlFor="image"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                >
                  <Upload color="white" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="image"
                  onChange={handleChangeImage}
                />
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter grocery name"
                  value={editGrocery?.name}
                  onChange={(e) =>
                    setEditGrocery({
                      ...editGrocery,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  onChange={(e) =>
                    setEditGrocery({ ...editGrocery, category: e.target.value })
                  }
                  value={editGrocery?.category}
                >
                  <option value={""}>Select Category</option>
                  {groceryCategories.map((cata, idx) => (
                    <option value={cata} key={idx}>
                      {cata}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Enter grocery price"
                  value={editGrocery?.price}
                  onChange={(e) =>
                    setEditGrocery({
                      ...editGrocery,
                      price: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  onChange={(e) =>
                    setEditGrocery({ ...editGrocery, unit: e.target.value })
                  }
                  value={editGrocery?.unit}
                >
                  <option value={""}>Select unit</option>
                  {units.map((unit, idx) => (
                    <option value={unit} key={idx}>
                      {unit}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition-all cursor-pointer">
                    <Trash size={18} />
                    <span>Delete Grocery</span>
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all cursor-pointer"
                    onClick={handleEditGrocery}
                  >
                    Edit Grocery
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewGroceries;
