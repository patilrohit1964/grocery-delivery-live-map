import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const user = await auth();
    const getUserOrders = await Order.find({ user: user?.user?.id });
    if (!getUserOrders) {
      return NextResponse.json(
        {
          message: "not found your any orders",
          success: false,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        message: "Orders Fetched",
        success: true,
        orders: getUserOrders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "while fetching my orders");
    return NextResponse.json(
      {
        message: "error during fetching my orders",
        success: false,
      },
      { status: 500 },
    );
  }
}
