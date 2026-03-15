"use client";
import axios from "axios";
import { ArrowLeft, Package } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ViewGroceries = () => {
  const [groceries, setGroceries] = useState([]);
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
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
      >
        <button
          className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
          <Package className="text-green-600" /> Mange Groceries
        </h1>
      </motion.div>
    </div>
  );
};

export default ViewGroceries;
