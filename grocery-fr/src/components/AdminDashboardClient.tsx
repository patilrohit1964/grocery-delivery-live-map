"use client";
import React, { useState } from "react";
import { motion } from "motion/react";

type PropType = {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  };
};
const AdminDashboardClient = ({ earning }: PropType) => {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">();
  const currentEarning =
    filter === "today"
      ? earning?.today
      : filter === "sevenDays"
        ? earning?.sevenDays
        : earning.total;
  return (
    <div className="pt-28 w-[90%] md:w-[80%] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-green-700"
        >
          🏪 Admin Dashboard
        </motion.h1>
        <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition w-full sm:w-auto">
          <option value="last 7 days">Last 7 Days</option>
          <option value="today">Today</option>
          <option value="total">Total</option>
        </select>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
