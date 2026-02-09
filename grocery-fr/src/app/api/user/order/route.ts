import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId, address, items, paymentMethod, totalAmount } =
      await req.json();
    if (!userId || !address || !items || !paymentMethod || !totalAmount) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 },
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 },
      );
    }
    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });
    return NextResponse.json(
      { message: "Order placed successfully", success: true, order: newOrder },
      { status: 201 },
    );
  } catch (error) {
    console.log(error, "error in order route");
    return NextResponse.json(
      { message: "Error placing order", success: false },
      { status: 500 },
    );
  }
}
