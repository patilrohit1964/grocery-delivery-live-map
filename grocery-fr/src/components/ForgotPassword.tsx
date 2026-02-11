import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail } from "lucide-react";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleForgotPass = async () => {};
  return (
    <motion.form
      onSubmit={handleForgotPass}
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-5 w-full max-w-sm"
    >
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="email"
          placeholder="enter your email"
          className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      <button
        type="submit"
        disabled={!email}
        className={`w-full font-semibold py-3 rounded-2xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${email ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Send Code
      </button>
    </motion.form>
  );
};

export default ForgotPassword;
