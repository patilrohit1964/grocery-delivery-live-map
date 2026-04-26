import connectDb from "@/lib/db";
import Stripe from "stripe";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "Snapcart Order Pyment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });
    return NextResponse.json(
      { message: "Order placed successfully", success: true, url: session.url },
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
