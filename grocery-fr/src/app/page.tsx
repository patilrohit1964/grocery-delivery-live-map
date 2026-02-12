import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home() {
  await connectDb();
  // using this we can access
  const session = await auth();
  const user = await User.findById(session?.user?.id).select("-password");
  if (!user) {
    return redirect("/login");
  }
  const inComplete =
    !user.mobile || !user?.role || (!user?.mobile && user?.role == "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id}/>
      {plainUser.role == "user" ? (
        <UserDashboard />
      ) : plainUser.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
    </>
  );
}
