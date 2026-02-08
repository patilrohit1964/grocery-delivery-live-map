"use client";
import { IOrder } from "@/models/order.model";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ManageOrders() {
  const [myOrders, setMyOrders] = useState<IOrder[]>();
  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const { data } = await axios.get("/api/admin/get-orders");
        console.log(data, "data");
        if (!data.success) {
          return toast.error(data.message || "something went wrong");
        }
        setMyOrders(data.orders);
        toast.success(data.message || "Your Orders");
      } catch (error: Error | any) {
        console.log(error, "something went wrong while fetching orders");
        return toast.error(error.message || "something went wrong");
      }
    };
    getMyOrders();
  }, []);
  return <div></div>;
}

export default ManageOrders;
