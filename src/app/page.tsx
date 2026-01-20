import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import Navbar from "@/components/Navbar";
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
  return (
    <>
      <Navbar user={user}/>
    </>
  );
}
