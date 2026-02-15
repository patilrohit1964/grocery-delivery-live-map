import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliverAssignment from "@/models/deliveryAssignment";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const assignments = await DeliverAssignment.find({
      broadcastTo: session?.user?.id,
      status: "broadcasted",
    }).populate("order");
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
