"use client";
import { getSocket } from "@/lib/socket";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get("/api/delivery/get-assignments");
        if (!data.success) {
          toast.error(data?.message || "assignments not found");
          return;
        }
        setAssignments(data?.assignments);
      } catch (error) {
        console.log(error, "error while geting assignments");
      }
    };
    fetchAssignments();
  }, []);
  useEffect((): any => {
    const socket = getSocket();
    // if listen then use on for socket in frontend
    socket?.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);
  const handleAcceptOrder = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/delivery/assignment/${id}/accept-assignment`,
      );
      if (!data.success) {
        toast.error(data?.message || "failed to accept assignment");
        return;
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-30 mb-7.5">
          Delivery Assignments
        </h2>
        {assignments?.map((assignment: any) => (
          <div
            className="p-5 bg-white rounded-xl shadow mb-4 border"
            key={assignment?._id}
          >
            <p>
              <b>Order Id</b>:{assignment?.order?._id.slice(-6) || "N/A"}
            </p>
            <p>{assignment?.order?.address?.fullAddress}</p>
            <div className="flex gap-3 mt-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer hover:bg-green-700 flex-1 bg-green-600 text-white py-2 rounded-lg"
                onClick={() => handleAcceptOrder(assignment?._id)}
              >
                {loading ? (
                  <>
                    <Loader2 />
                    "Accepting..."
                  </>
                ) : (
                  "Accept"
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer hover:bg-red-700 flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Reject
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
