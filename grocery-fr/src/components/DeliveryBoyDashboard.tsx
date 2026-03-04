"use client";
import userGetMe from "@/hooks/userGetMe";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LiveMap from "./LiveMap";
import DeliveryChat from "./DeliveryChat";
export interface ILocation {
  latitude: number;
  longitude: number;
}
const DeliveryBoyDashboard = () => {
  userGetMe();
  // loading state start
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // loading state end
  const [assignments, setAssignments] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showOtpBox, setShowOtpBox] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryLocation, setDeliveryLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const { userData } = useSelector((state: RootState) => state.user);
  // get all delivery boy orders
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
  // track live location code of delivery boy
  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    // watch delivery boy live location
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDeliveryLocation({
          latitude: latitude,
          longitude: longitude,
        });
        // update location using socket
        socket.emit("updateLocation", {
          userId: userData?._id,
          latitude,
          longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();
    // if listen then use on for socket in frontend
    socket?.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);

  // accept order delivery boy
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

  // fetch delivery boy current orders
  const fetchCurrentOrder = async () => {
    try {
      const { data } = await axios.get("/api/delivery/current-order");
      if (!data.success) {
        toast.error(data?.message || "No current order assigned");
        return;
      }
      setActiveOrder(data.data);
      setUserLocation({
        latitude: data?.data.order?.address?.latitude,
        longitude: data.data?.order?.address?.longitude,
      });
      // console.log(data, "current order data");
    } catch (error) {
      console.log(error);
    }
  };

  // update delivery boy location
  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryLocation({
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, []);

  // call fetchcurrentorder and fetchassignments
  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignments();
  }, [userData]);

  // send otp to user for order verified
  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const { data } = await axios.post(`/api/delivery/otp/send`, {
        orderId: activeOrder.order._id,
      });
      if (!data.success) {
        return toast.error(data.message || "something wrong");
      }
      toast.success(data.message);
      setShowOtpBox(true);
      setOtpLoading(false);
    } catch (error) {
      console.log(error, "error while send otp");
      setOtpLoading(false);
    } finally {
      setOtpLoading(false);
    }
  };

  // verify order if order delivered
  const handleVerifyOtp = async () => {
    setVerifyLoading(true);
    try {
      const { data } = await axios.post(`/api/delivery/otp/verify`, {
        orderId: activeOrder.order._id,
        otp,
      });
      if (!data.success) {
        return toast.error(data.message || "something wrong");
      }
      toast.success(data.message);
      setShowOtpBox(false);
      setActiveOrder(null);
      setVerifyLoading(false);
      // await fetchCurrentOrder();
    } catch (error) {
      console.log(error, "error while send otp");
      setVerifyLoading(false);
    } finally {
      setVerifyLoading(false);
    }
  };
  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-30 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>
          <p>Order#: {activeOrder.order._id.slice(-6)}</p>
          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryLocation={deliveryLocation}
            />
          </div>
          <DeliveryChat
            orderId={activeOrder.order._id.toString()}
            deliveryBoyId={userData?._id?.toString()!}
          />
          <div className="mt-6 rounded-xl border shadow p-6">
            {!activeOrder.order.deliveryOtpVerified && !showOtpBox && (
              <button
                className={`w-full py-4 bg-green-600 text-white rounded-lg ${otpLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} hover:bg-green-700 transition-all duration-300`}
                onClick={handleSendOtp}
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    OTP send...
                  </div>
                ) : (
                  "Mark as Delivered"
                )}
              </button>
            )}
            {showOtpBox && (
              <div className="mt-4">
                <input
                  type="number"
                  className="w-full py-3 border rounded-lg text-center"
                  placeholder="Enter Otp"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
                <button
                  className={`w-full mt-3 py-4 bg-green-600 text-white rounded-lg ${verifyLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} hover:bg-green-700 transition-all duration-300`}
                  onClick={handleVerifyOtp}
                >
                  {verifyLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" />
                      Verifying
                    </div>
                  ) : (
                    "Verify Otp"
                  )}
                </button>
              </div>
            )}
            {activeOrder.order.deliveryOtpVerified && (
              <div className="text-green-700 text-center font-bold">
                Delivered
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
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
                className={`${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} hover:bg-green-700 flex-1 bg-green-600 text-white py-2 rounded-lg`}
                onClick={() => handleAcceptOrder(assignment?._id)}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    Accepting...
                  </div>
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
