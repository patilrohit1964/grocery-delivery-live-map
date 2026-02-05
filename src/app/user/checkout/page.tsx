"use client";
import { RootState } from "@/redux/store";
import axios from "axios";
import L, { LatLngExpression } from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import {
  ArrowLeft,
  Building,
  CreditCard,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
const provider = new OpenStreetMapProvider();
const marker = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
}); //we can set icon as we want
const Checkout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [mapSearchLoading, setMapSearchLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData } = useSelector((state: RootState) => state.cart);
  console.log(userData, "userdata");
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log(err, "location error"),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);
  useEffect(() => {
    if (userData) {
      setAddress({
        ...address,
        fullName: userData.name || "",
        mobile: userData.mobile || "",
      });
    }
  }, [userData]);

  // for marker animate if we drag marker then animate map with that marker
  const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression);
    }, [position]);
    return (
      <Marker
        position={position as LatLngExpression}
        icon={marker}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const dragMarker = e.target as L.Marker;
            const { lat, lng } = dragMarker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      >
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    const getLatLngFromAddress = async () => {
      if (!position) return null;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        console.log(res.data, "res");
        setAddress((prev) => ({
          ...prev,
          city: res.data.address.city,
          state: res.data.address.state,
          pincode: res.data.address.postcode,
          fullAddress: res.data.display_name,
        }));
      } catch (error) {
        console.log(error, "error while fetching address");
      }
    };
    getLatLngFromAddress();
  }, [position]);

  // for location searching
  const handleSearchQuery = async () => {
    setMapSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    console.log(results, "resutls");
    if (results) {
      setPosition([results[0].y, results[0].x]);
    }
    setMapSearchLoading(false);
  };

  // got to current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log(err, "location error"),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  };
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className={`bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium ${mapSearchLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                onClick={handleSearchQuery}
                disabled={mapSearchLoading}
              >
                {mapSearchLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />{" "}
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </div>
            {/* map div */}
            <div className="relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position && (
                <MapContainer
                  center={position as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker />
                </MapContainer>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999 cursor-pointer"
                onClick={handleCurrentLocation}
              >
                <LocateFixed size={22} />
              </motion.button>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard />
            Payment Method
          </h2>
          <div className="space-y-4 mb-6">
            <button
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all cursor-pointer ${paymentMethod === "online" ? "border-green-600 bg-green-100 shadow-sm" : "hover:bg-gray-50"} `}
              onClick={() => setPaymentMethod("online")}
            >
              <CreditCard className="text-green-600" />
              <span>Pay Online (stripe)</span>
            </button>
            <button
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all cursor-pointer ${paymentMethod === "cod" ? "border-green-600 bg-green-100 shadow-sm" : "hover:bg-gray-50"} `}
              onClick={() => setPaymentMethod("cod")}
            >
              <Truck className="text-green-600" />
              <span>Cash On Delivery (cod)</span>
            </button>
          </div>
          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold text-gray-600">{}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery Fee</span>
              <span className="font-semibold text-gray-600">{}</span>
            </div>
            <div className="flex justify-between text-lg border-t pt-3">
              <span className="font-bold">Final Total</span>
              <span className="font-semibold text-gray-600">{}</span>
            </div>
            <motion.button whileTap={{scale:0.95}} className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold cursor-pointer">
              {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
