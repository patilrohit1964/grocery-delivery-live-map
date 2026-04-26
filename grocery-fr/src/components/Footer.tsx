"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-linear-to-r from-green-600 to-green-700 text-white mt-20"
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-500/40">
        <div>
          <h2 className="text-2xl mb-3 font-bold">Snapcart</h2>
          <p className="text-sm text-green-100 leading-relaxed">
            your one-stop online grocery store delivering freshness to your
            doorstep. shop smart, eat fresh, and save more every day!
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-green-300 text-sm">
            <li>
              <Link href={"/"} className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href={"/user/cart"} className="hover:text-white transition">
                Cart
              </Link>
            </li>
            <li>
              <Link
                href={"/user/my-orders"}
                className="hover:text-white transition"
              >
                My Orders
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Mumbai,India
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 1234567890
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@snapcart.com
            </li>
          </ul>
          {/* social links */}
          <div className="flex gap-4 mt-4">
            <Link
              href={"https://facebook.com/snapcart"}
              className="hover:text-white transition"
            >
              <Facebook size={20} />
            </Link>
            <Link
              href={"https://twitter.com/snapcart"}
              className="hover:text-white transition"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href={"https://instagram.com/snapcart"}
              className="hover:text-white transition"
            >
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center py-4 text-sm text-green-100 bg-green-800/50">
        &copy; {new Date().getFullYear()} Snapcart. All rights reserved.
      </div>
    </motion.div>
  );
};

export default Footer;
