"use client";
import {
  Apple,
  Baby,
  Box,
  Coffee,
  Cookie,
  Flame,
  Heart,
  Home,
  Milk,
  Wheat,
} from "lucide-react";
import { motion } from "motion/react";
const categories = [
  {
    id: 1,
    name: "fruits & vegetables",
    icon: <Apple className="w-10 h-10 text-green-700 mb-3" />,
    color: "bg-green-100",
  },
  {
    id: 2,
    name: "dairy & eggs",
    icon: <Milk className="w--10 text-green-700 mb-3" />,
    color: "bg-yellow-100",
  },
  {
    id: 3,
    name: "rice,atta & grains",
    icon: <Wheat className="w--10 text-green-700 mb-3" />,
    color: "bg-orange-100",
  },
  {
    id: 4,
    name: "snaks & biscuits",
    icon: <Cookie className="w--10 text-green-700 mb-3" />,
    color: "bg-pink-100",
  },
  {
    id: 5,
    name: "spices & masalas",
    icon: <Flame className="w--10 text-green-700 mb-3" />,
    color: "bg-red-100",
  },
  {
    id: 6,
    name: "beverages & drinks",
    icon: <Coffee className="w--10 text-green-700 mb-3" />,
    color: "bg-blue-100",
  },
  {
    id: 7,
    name: "personal care",
    icon: <Heart className="w--10 text-green-700 mb-3" />,
    color: "bg-purple-100",
  },
  {
    id: 8,
    name: "household essentials",
    icon: <Home className="w--10 text-green-700 mb-3" />,
    color: "bg-lime-100",
  },
  {
    id: 9,
    name: "instant & packaged food",
    icon: <Box className="w--10 text-green-700 mb-3" />,
    color: "bg-teal-100",
  },
  {
    id: 10,
    name: "baby & pet care",
    icon: <Baby className="w--10 text-green-700 mb-3" />,
    color: "bg-rose-100",
  },
];
const CategorySlider = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      //   this whileview help to trigger animation when element is in view means scroll
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      //   this viewport help to trigger animation only once if true if false then they work on every scroll
      //   amount help to trigger animation when element you want show
      viewport={{ once: false, amount: 0.5 }}
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
        🛒 Shop by Category
      </h2>
      <div className="flex gap-6 overflow-x-auto  px-10 pb-4 scrollbar-hide scroll-smooth">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.5 }}
            className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl gap-2 ${category.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
          >
            <div className="flex flex-col items-center justify-center p-5">
              {category.icon}
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {category.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategorySlider;
