import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliverAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDb();
    const { id } = await params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        { status: 401 },
      );
    }
    const assignment = await DeliverAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "assignment not found",
        },
        { status: 400 },
      );
    }
    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        {
          success: false,
          message: "assignment already accepted",
        },
        { status: 400 },
      );
    }
    const alreadyAssigned = await DeliverAssignment.findOne({
      assignTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] },
    });
    if (alreadyAssigned) {
      return NextResponse.json(
        {
          success: false,
          message: "you have already an active assignment",
        },
        { status: 400 },
      );
    }
    assignment.assignTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "order not found",
        },
        { status: 400 },
      );
    }
    order.assignDeliveryBoy = deliveryBoyId;
    await order.save();
    await DeliverAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastTo: deliveryBoyId,
        status: "broadcasted",
      },
      {
        $pull: { broadcastTo: deliveryBoyId },
      },
    );
    return NextResponse.json(
      {
        success: true,
        message: "order accepted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error while accepting assignments");
    return NextResponse.json(
      {
        success: false,
        message: "error while accepting assignment",
      },
      { status: 500 },
    );
  }
}
