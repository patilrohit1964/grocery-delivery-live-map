"use client";
import { Bike, type LucideIcon, User, UserCog } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
interface User {
  id: string;
  label: string;
  icon: LucideIcon;
}
const EditRoleMobile = () => {
  const [roles, setRoles] = useState<User[]>([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRole, setSelectedRole] = useState<String>("");
  return (
    <div className="flex flex-col min-h-screen p-6 w-full bg-white">
      <motion.h1
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              whileTap={{ scale: 0.94 }}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-green-600 bg-green-100 shadow-lg"
                  : "border-gray-300 bg-white hover:border-green-400"
              }`}
            >
              <role.icon />
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col items-center mt-10"
      >
        <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">
          Enter Your Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          placeholder="Enter Your Mobile No."
        />
      </motion.div>
    </div>
  );
};

export default EditRoleMobile;
