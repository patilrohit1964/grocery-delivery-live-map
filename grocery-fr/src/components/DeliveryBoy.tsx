import { auth } from "@/auth";
import DeliveryBoyDashboard from "./DeliveryBoyDashboard";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

const DeliveryBoy = async () => {
  await connectDb();
  const session = await auth();
  const deliverBoyId = session?.user?.id;
  const orders = await Order.find({
    assignDeliveryBoy: deliverBoyId,
    deliveryOtpVerified: true,
  });
  const today = new Date().toString();
  const todayOrders = orders.filter(
    (o) => new Date(o.deliveredAt).toDateString() === today,
  ).length;
  const todaysEarnings = todayOrders * 40;

  return (
    <div>
      <DeliveryBoyDashboard earnings={todaysEarnings} />
    </div>
  );
};

export default DeliveryBoy;
