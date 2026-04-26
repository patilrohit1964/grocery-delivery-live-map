"use client";
import googleImg from "@/assests/download.jpg";
import ForgotPassword from "@/components/ForgotPassword";
import { Eye, EyeClosed, Leaf, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      const res = await signIn("credentials", {
        email: form?.email,
        password: form.password,
        redirect: false,
      });
      if (res.error) {
        return toast.error("invalid credentials");
      }
      toast.success("login successful");
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error, "error while login");
      setLoading(false);
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
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome Back
      </motion.h1>
      <p className="text-gray-600 mb-8 flex items-center gap-2">
        Login Snapcart <Leaf className="w-5 h-5 text-green-600" />
      </p>
      {forgotPass ? (
        <ForgotPassword />
      ) : (
        <>
          <motion.form
            onSubmit={handleLogin}
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                value={form.email}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="enter your password"
                className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                value={form.password}
                required
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
              <div className="text-end">
                <p
                  className="text-green-600 cursor-pointer hover:text-green-700"
                  onClick={() => setForgotPass(true)}
                >
                  Forgot Password ?
                </p>
              </div>
            </div>
            {(() => {
              const formValidation = form.email !== "" && form.password !== "";
              return (
                <button
                  type="submit"
                  disabled={!formValidation || loading}
                  className={`w-full font-semibold py-3 rounded-2xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${formValidation ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"} ${loading ? "cursor-not-allowed opacity-50" : "opacity-100 cursor-pointer"}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              );
            })()}
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
              <span className="flex-1 h-px bg-gray-200"></span>
              OR
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>
          </motion.form>
          <button
            className="md:w-96 w-72 flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-200 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer mt-2"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            type="button"
          >
            <Image src={googleImg} width={20} height={20} alt="google image" />
            Continue with Google
          </button>
          <Link href={"/register"}>
            <p className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1">
              Don't have an account ? <LogIn className="w-4 h-4" />{" "}
              <span className="text-green-500 hover:underline ">Sign Up</span>
            </p>
          </Link>
        </>
      )}
    </div>
  );
};

export default Login;
