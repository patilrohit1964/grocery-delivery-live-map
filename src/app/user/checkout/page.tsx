"use client";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Building,
  Home,
  MapPin,
  Navigation,
  Phone,
  Search,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

const Checkout = () => {
  const [select, setSelect] = useState(1);
  const { userData } = useSelector((state: RootState) => state.user);
  console.log(userData, "data");
  const [address, setAddress] = useState({
    fullName: userData?.name,
    mobile: userData?.mobile,
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
  return (
    <div className="w-[95%] md:w-[80%] mx-auto py-10 relative">
      <Link href={"/"}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="absolute top-0 left-0 flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="hidden md:inline">Back To Cart</span>
        </motion.button>
      </Link>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-3xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>
          <div className="space-y-4">
            {/* full name input */}
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Your Name"
                value={address?.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
              />
            </div>
            {/* phone input */}
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Your Phone Number"
                value={address?.mobile}
                onChange={(e) =>
                  setAddress({ ...address, mobile: e.target.value })
                }
              />
            </div>
            {/* address input */}
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Your Address"
                value={address?.fullAddress}
                onChange={(e) =>
                  setAddress({ ...address, fullAddress: e.target.value })
                }
              />
            </div>
            {/* city,state,pincode inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="Your City"
                  value={address?.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="Your state"
                  value={address?.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="Your Pincode"
                  value={address?.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                />
              </div>
            </div>
            {/* search bar input */}
            <div className="flex gap-2 mt-3">
              <input
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Search city or area"
                value={address?.fullAddress}
                onChange={(e) =>
                  setAddress({ ...address, fullAddress: e.target.value })
                }
              />
              <button className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium cursor-pointer">
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
