import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliverAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();
    if (!orderId || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "orderId and otp must be required",
        },
        { status: 400 },
      );
    }
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
    if (order.deliveryOtp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "incorrect or expired OTP",
        },
        { status: 400 },
      );
    }
    order.status = "delivered";
    order.deliveryOtpVerified = true;
    order.deliveredAt = new Date();
    await order.save();
    await emitEventHandler("order-status-update", {
      orderId: order?._id,
      status: order?.status,
    });
    await DeliverAssignment.updateOne(
      {
        order: orderId,
      },
      { $set: { assignTo: null, status: "completed" } },
    );
    return NextResponse.json(
      {
        success: true,
        message: "OTP Verified Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error while verified otp");
    return NextResponse.json(
      {
        success: true,
        message: "error while send otp",
      },
      { status: 500 },
    );
  }
}
