import { deliveryOtpEmailTemplate } from "@/emails/delivery-otp";
import connectDb from "@/lib/db";
import sendEmail from "@/lib/sendCode";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "order not found",
        },
        { status: 400 },
      );
    }
    const otp = Math.floor(Math.random() * 9000).toString();
    order.deliveryOtp = otp;
    await order.save();
    sendEmail(
      "Your Delivery Otp",
      order.user.email,
      deliveryOtpEmailTemplate(otp, order?.user?.name),
    );
    return NextResponse.json(
      {
        success: true,
        message: "OTP Send Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error while send otp");
    return NextResponse.json(
      {
        success: true,
        message: "error while send otp",
      },
      { status: 500 },
    );
  }
}
