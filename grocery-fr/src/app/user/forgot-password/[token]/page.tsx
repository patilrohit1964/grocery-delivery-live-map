"use client";
import axios from "axios";
import { Eye, EyeClosed, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { FormEvent, use, useState } from "react";
import { toast } from "react-toastify";

function ForgotPassword({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleForgotPass = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/forgot-password", {
        password: form.password,
        token,
      });
      if (!data.success) {
        toast.error(data.message);
      }
      toast.success(data.message);
      router.push("/login");
    } catch (error) {
      console.log(error, "error forgot pass");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{
          y: -10,
          opacity: 0,
        }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 mb-4"
      >
        Forgot Password
      </motion.h1>
      <>
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
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="enter your password"
              className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              value={form.password}
            />
            {showPass ? (
              <Eye
                className="absolute right-3 cursor-pointer top-3.5 w-5 h-5 text-gray-400"
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <EyeClosed
                className="absolute right-3 cursor-pointer top-3.5 w-5 h-5 text-gray-400"
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="confirm password"
              className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              value={form.confirmPassword}
            />
            {showPass ? (
              <Eye
                className="absolute right-3 cursor-pointer top-3.5 w-5 h-5 text-gray-400"
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <EyeClosed
                className="absolute right-3 cursor-pointer top-3.5 w-5 h-5 text-gray-400"
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>
          {(() => {
            const formValidation =
              form.password !== "" && form.confirmPassword !== "";
            return (
              <button
                type="submit"
                disabled={!formValidation}
                className={`w-full font-semibold py-3 rounded-2xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${formValidation ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Forgot Password
              </button>
            );
          })()}
        </motion.form>
      </>
    </div>
  );
}

export default ForgotPassword;
