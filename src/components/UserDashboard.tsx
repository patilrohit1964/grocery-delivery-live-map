import connectDb from "@/lib/db";
import CategorySlider from "./CategorySlider";
import HeroSection from "./HeroSection";
import Grocery from "@/models/grocery.model";
import GroceryItems from "./GroceryItems";

const UserDashboard = async () => {
  await connectDb();
  const groceryItems = await Grocery.find().lean();
  const plainGrocery = JSON.parse(JSON.stringify(groceryItems));
  console.log(plainGrocery)
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className="w-[90%] md:w-[80%] mx-auto mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
          Popular Grocery Items
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainGrocery.map((groceryItem: any) => (
            <GroceryItems key={groceryItem._id} groceryItem={groceryItem} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
