"use client";

import userGetMe from "@/hooks/userGetMe";

const AdminDashboard = () => {
  userGetMe();
  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
