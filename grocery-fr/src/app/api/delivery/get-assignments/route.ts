import { auth } from "@/auth";
import connectDb from "@/lib/db";
import mongoose from "mongoose";
import DeliverAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const assignments = await DeliverAssignment.find({
      broadcastTo: session?.user?.id,
      status: "broadcasted",
    }).populate("order");
    console.log(assignments,'assign')
    return NextResponse.json(
      {
        message: "assigments",
        success: true,
        assignments,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error while delivery boys getting notification");
    return NextResponse.json(
      {
        message: "server error",
        success: false,
      },
      { status: 200 },
    );
  }
}
