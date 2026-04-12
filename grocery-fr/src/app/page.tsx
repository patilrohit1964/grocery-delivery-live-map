import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/lib/db";
import Grocery, { IGROCERY } from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home(props: {
  searchParams: Promise<{ q: string }>;
}) {
  await connectDb();
  // using this we can access
  const session = await auth();
  const user = await User?.findById(session?.user?.id).select("-password");
  if (!user) {
    return redirect("/login");
  }
  const inComplete =
    !user.mobile || !user?.role || (!user?.mobile && user?.role == "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  const searchParams = await props.searchParams;
  let groceryList: IGROCERY[] = [];
  if (user.role == "user") {
    if (searchParams?.q) {
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams?.q, $options: "i" } },
          { category: { $regex: searchParams?.q, $options: "i" } },
        ],
      });
    } else {
      groceryList = await Grocery.find({});
    }
  }
  return (
    <>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {plainUser.role == "user" ? (
        <UserDashboard groceryList={groceryList} />
      ) : plainUser.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
    </>
  );
}
