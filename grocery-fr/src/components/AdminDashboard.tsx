import connectDb from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Grocery from "@/models/grocery.model";
const AdminDashboard = async () => {
  await connectDb();
  const orders = await Order.find();
  const users = await User.find({ role: "user" });
  const groceries = await Grocery.find();
  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDeliveries = orders.filter(
    (ord) => ord?.status === "pending",
  ).length;
  const totalRevenue = orders?.reduce(
    (sum, ord) => sum + ord?.totalAmount || 0,
    0,
  );
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today?.getDate() - 6);

  // if order created is greater than today then retur todays orders data
  const todaysOrders = orders?.filter(
    (ord) => new Date(ord?.createdAt) >= startOfToday,
  );
  const todayRevenue = todaysOrders.reduce(
    (sum, ord) => sum + (ord?.totalAmount || 0),
    0,
  );
  const sevenDaysOrders = orders.filter(
    (ord) => new Date(ord?.createdAt) >= sevenDaysAgo,
  );
  const sevenDaysRevenue = todaysOrders.reduce(
    (sum, ord) => sum + (ord?.totalAmount || 0),
    0,
  );
  const stats = [
    { title: "Total Orders", value: totalOrders },
    { title: "Total Customers", value: totalCustomers },
    { title: "Pending Deliveries", value: pendingDeliveries },
    { title: "Total Revenue", value: totalRevenue },
  ];
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    // using this we get date
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    // get next date
    nextDay.setDate(nextDay.getDate() + 1);

    const ordersCount = orders.filter(
      (ord, idx) =>
        new Date(ord?.createdAt) >= date && new Date(ord?.createdAt) < nextDay,
    ).length;

    chartData.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      orders: ordersCount,
    });
  }
  return (
    <div>
      <AdminDashboardClient
        earning={{
          total: totalRevenue,
          sevenDays: sevenDaysRevenue,
          today: todayRevenue,
        }}
        stats={stats}
        chartData={chartData}
      />
    </div>
  );
};

export default AdminDashboard;
