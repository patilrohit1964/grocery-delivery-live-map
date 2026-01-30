"use client";
import { ArrowLeft, CreditCard, MapPin, Truck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const Checkout = () => {
  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 relative">
      <Link
        href={"/"}
        className="absolute -top-2 left-0 flex items-center gap-2 text-green-700 font-medium hover:bg-green-800 transition-all px-4 py-2 rounded-full shadow-md hover:shadow-lg duration-300 hover:text-white"
      >
        {/* className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all" */}
        <ArrowLeft size={20} />
        <span className="hidden md:inline">Back To Cart</span>
      </Link>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h2>
      <div className="flex gap-8">
        {/* user details div */}
        <div className="shadow-md rounded-2xl p-4 ">
          <h3 className="flex gap-2 font-medium ">
            <MapPin className="text-green-700" /> Delivery Address
          </h3>
          {/* all user details input */}
          <div className="grid gap-4 my-4">
            {/* div 1 */}
            <div className="">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="Your Name"
              />
            </div>
            {/* div 2 */}
            <div className="">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="Your Phone Number"
              />
            </div>
            {/* div 3 */}
            <div className="">
              <textarea
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="Your Address"
              />
            </div>
            {/* div 4 */}
            <div className="flex gap-2 items-center">
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="City"
              />
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="state"
              />
              <input
                className="w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="pincode"
              />
            </div>
            {/* div 5 */}
            <div className="flex">
              <input
                className="flex-1 gap-2 items-center rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 transition-all"
                placeholder="Search city or area"
              />
              <button className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 rounded-lg">
                Search
              </button>
            </div>
            {/* div 6 */}
            <div className="">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7442.5726911278025!2d72.78280326957798!3d21.140999856772844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1769749165807!5m2!1sen!2sin"
                width="600"
                height="450"
                // style="border:0;"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        {/* checkout div */}
        <div className="shadow-md rounded-2xl p-4 w-full">
          <h3 className="flex gap-2 font-medium items-center ">
            <CreditCard className="text-green-700" /> Payment Method
          </h3>
          <div className="flex flex-col">
            <motion.button
              whileTap={{ scale: 0.8 }}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition-all cursor-pointer border border-gray-600 hover:bg-green-100 flex items-center gap-2`}
            >
              <CreditCard className="text-green-700" />
              Pay Online (Stripe)
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition-all cursor-pointer border border-gray-600 hover:bg-green-100 flex items-center gap-2`}
            >
              <Truck className="text-green-700" />
              Cash On Delivery
            </motion.button>
          </div>
          <hr className="mt-4"/>
          <div className="flex flex-col gap-2 py-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-green-700">₹3860</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-green-700">₹40</span>
            </div>
          </div>
          <hr />
          <div className="flex justify-between border-t border-gray-200 pt-3 text-lg sm:text-xl">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-green-700">₹4000</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            className={`w-full mt-4 py-3 px-4 rounded-full font-medium transition-all cursor-pointer bg-green-600 hover:bg-green-700 text-white`}
          >
            Place Order
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
