import connectDb from "@/lib/db";
import { IGROCERY } from "@/models/grocery.model";
import CategorySlider from "./CategorySlider";
import GroceryItems from "./GroceryItems";
import HeroSection from "./HeroSection";

const UserDashboard = async ({ groceryList }: { groceryList: IGROCERY[] }) => {
  await connectDb();
  const plainGrocery = JSON.parse(JSON.stringify(groceryList));

  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className="w-[90%] md:w-[80%] mx-auto mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
          Popular Grocery Items
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainGrocery.length > 0 ? (
            plainGrocery?.map((groceryItem: any) => (
              <GroceryItems key={groceryItem?._id} groceryItem={groceryItem} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No grocery items found.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
