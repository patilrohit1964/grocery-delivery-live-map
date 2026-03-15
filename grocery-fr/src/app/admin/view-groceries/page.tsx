"use client";
import { IGROCERY } from "@/models/grocery.model";
import axios from "axios";
import { ArrowLeft, Package, Pencil, Search } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ViewGroceries = () => {
  const [groceries, setGroceries] = useState<IGROCERY[]>([]);
  const router = useRouter();
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
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer">
                  <Pencil size={15} />
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ViewGroceries;
