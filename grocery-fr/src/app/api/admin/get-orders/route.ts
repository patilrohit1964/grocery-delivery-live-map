import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const orders = await Order.find().populate(
      "user",
      "name email mobile image",
    );
    if (!orders) {
      return NextResponse.json(
        {
          success: false,
          message: "orders not found",
          orders,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Orders Fetched",
        orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "something went wrong",
      },
      { status: 500 },
    );
  }
}
