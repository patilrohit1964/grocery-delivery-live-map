"use client";
import axios from "axios";
import { Bike, type LucideIcon, User, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
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
  const { update } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits

    if (value.length > 10) return; // stop typing after 10

    setMobile(value);

    if (value.length === 0) {
      setMobileError("");
    } else if (value.length < 10) {
      setMobileError("Mobile number must be exactly 10 digits");
    } else {
      setMobileError("");
    }
  };

  const handleEditMobileRole = async () => {
    try {
      const mobileRoleRes = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      if (!mobileRoleRes?.data?.success) {
        toast(mobileRoleRes?.data?.message);
      }
      toast(mobileRoleRes?.data?.message || "Details Update");
      // when use update function for session update then use trigger in auth.ts jwt function always remember imp
      await update(mobileRoleRes?.data?.data);
      return router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full bg-white">
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
          type="text"
          id="mobile"
          value={mobile}
          onChange={handleMobileChange}
          placeholder="Enter Your Mobile No."
          className={`w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 ${
            mobileError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-400 focus:ring-green-500"
          }`}
        />

        {mobileError && (
          <span className="text-red-500 text-sm mt-1">{mobileError}</span>
        )}
      </motion.div>
      <motion.button
        onClick={handleEditMobileRole}
        disabled={!selectedRole || mobile.length !== 10}
        className={`inline-flex items-center mt-3 cursor-pointer gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all ${
          selectedRole && mobile.length === 10
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Go To Home
      </motion.button>
    </div>
  );
};

export default EditRoleMobile;
