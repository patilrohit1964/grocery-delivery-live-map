import { auth } from "@/auth";
import connectDb from "@/lib/db";
import "@/lib/registerModels";
import DeliverAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";
// get cuurent delivery boy orders
export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    const currentOrder = await DeliverAssignment.findOne({
      assignTo: deliveryBoyId,
      status: "assigned",
    })
      .populate({
        path: "order",
        populate: { path: "user", select: "location name mobile isOnline" },
      })
      .lean();
    if (!currentOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "No current order assigned",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "current order fetched successfully",
        data: currentOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error fetching current order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching current order",
      },
      { status: 500 },
    );
  }
}
