"use client";
import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const userGetMe = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await axios.get("/api/me");
        if (!result?.data?.success) {
          toast.error(result?.data?.message || "failed to get user details");
        }
        dispatch(setUserData(result?.data?.data));
      } catch (error) {
        console.log(error, "error");
      }
    };
    getMe();
  }, []);
};

export default userGetMe;
