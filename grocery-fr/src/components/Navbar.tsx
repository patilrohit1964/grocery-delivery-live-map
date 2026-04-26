"use client";
import { RootState } from "@/redux/store";
import { logoutUser } from "@/redux/userSlice";
import {
  Boxes,
  ClipboardCheckIcon,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Search,
  ShoppingCartIcon,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  image?: string;
  role: "user" | "deliveryBoy" | "admin";
}
const Navbar = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const profileDropDown = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // this createportal help us to insert element on direct dom this createportal don't have any parent they insert element direct on dom
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = search.trim().toLowerCase();
    if (!query) {
      return router.push("/");
    }
    router.push(`?q=${encodeURIComponent(query)}`);
    setSearch("");
    setSearchOpen(false);
  };
  const sidebar = menuOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            // this type help to add animation on our element,damping help us to control bounce of type animation
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            exit={{ x: -100 }}
            className="fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-2000 bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90 backdrop-blur-xl border-r border-green-400/20 shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)] flex flex-col p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-extrabold text-2xl tracking-wide text-white/90">
                Admin Panel
              </h1>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-red-400 text-2xl font-bold transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* user admin profile */}
            <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner ">
              <div className="flex items-center gap-3 px-3 py-2">
                {/* user admin image */}
                <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-green-400/60 shadow-lg">
                  {user?.image ? (
                    <Image
                      src={user?.image}
                      className="object-cover rounded-full"
                      alt="user"
                      fill
                    />
                  ) : (
                    <User />
                  )}
                </div>
                {/* user admin name and role */}
                <div>
                  <h2 className="text-lg font-semibold text-white capitalize">
                    Name: {user?.name}
                  </h2>
                  <p className="text-xs capitalize tracking-wide text-gray-200">
                    Role: {user?.role}
                  </p>
                </div>
              </div>
            </div>
            {/* admin options buttons */}
            <div className="flex flex-col gap-3 font-medium mt-6">
              <Link
                href={"/admin/add-grocery"}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Add Grocery
              </Link>
              <Link
                href={"/admin/view-groceries"}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <Boxes className="w-5 h-5" />
                View Grocery
              </Link>
              <Link
                href={"/admin/manage-orders"}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <ClipboardCheckIcon className="w-5 h-5" />
                Manage Orders
              </Link>
            </div>
            <div className="my-5 border-t border-white/20"></div>
            <button
              className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all"
              onClick={async () => {
                signOut({ callbackUrl: "/" });
                dispatch(logoutUser());
              }}
            >
              <LogOut className="w-5 h-5 text-red-300" />
              Log Out
            </button>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null;
  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-14 px-4 md:px-8 z-50">
      {/* logo ui */}
      <Link
        href={"/"}
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform"
      >
        Snapcart
      </Link>

      {/* search ui */}
      {user?.role === "user" && (
        <form
          className="hidden md:flex items-center bg-white rounded-full w-1/2 px-4 py-2 max-w-lg shadow-md"
          onSubmit={handleSearchSubmit}
        >
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search Groceries..."
            className="w-full outline-none text-gray-700 placeholder-gray-400"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </form>
      )}

      <div className="flex items-center gap-3 md:gap-6 relative">
        {user?.role === "user" && (
          <>
            <div
              className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition-all md:hidden"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <Link
              href={"/user/cart"}
              className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
            >
              <ShoppingCartIcon className="text-green-600 w-6 h-6" />
              <span className="absolute top-0 right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold shadow">
                {cartData.length || 0}
              </span>
            </Link>
          </>
        )}
        {/* admin ui */}
        {user?.role === "admin" && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={"/admin/add-grocery"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Add Grocery
              </Link>
              <Link
                href={"/admin/view-groceries"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <Boxes className="w-5 h-5" />
                View Grocery
              </Link>
              <Link
                href={"/admin/manage-orders"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <ClipboardCheckIcon className="w-5 h-5" />
                Manage Orders
              </Link>
            </div>
            <div
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
            >
              <Menu className="w-6 h-6 text-green-600" />
            </div>
          </>
        )}
        {/* user profile ui */}
        <div className="relative" ref={profileDropDown}>
          {/* user */}
          <div
            className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
            title={user?.name}
          >
            {user?.image ? (
              <Image
                src={user?.image}
                className="object-cover rounded-full"
                alt="user"
                fill
              />
            ) : (
              <User />
            )}
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999"
              >
                <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                  <div className="w-10 h-10 relative rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {user?.image ? (
                      <Image
                        src={user?.image}
                        className="object-cover rounded-full"
                        alt="user"
                        fill
                      />
                    ) : (
                      <User />
                    )}
                  </div>
                  <div>
                    <div className="text-gray-800 font-semibold capitalize">
                      Name: {user?.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      Role: {user?.role}
                    </div>
                  </div>
                </div>
                {user?.role === "user" && (
                  <Link
                    href={"/user/my-orders"}
                    className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    <Package className="w-5 h-5 text-green-600" />
                    My Orders
                  </Link>
                )}
                <button
                  className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
              >
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <form className="grow" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="w-full outline-none text-gray-700"
                    placeholder="Search groceries..."
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                </form>
                <button onClick={() => setSearchOpen(false)}>
                  <X className="text-gray-500 w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {sidebar}
    </div>
  );
};

export default Navbar;
