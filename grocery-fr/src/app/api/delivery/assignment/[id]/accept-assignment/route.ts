import { auth } from "@/auth";
import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliverAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const { id } = await context.params;
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
    // find delivery boy order(assignment)
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
    // if user accepted already then not allow to accept again
    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        {
          success: false,
          message: "assignment already accepted",
        },
        { status: 400 },
      );
    }
    // if already accept then not allow to accept another assignment until complete current assignment
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
    await order.populate("assignDeliveryBoy");
    await emitEventHandler("order-assigned", {
      assignDeliveryBoy: order.assignDeliveryBoy,
      orderId: order._id,
    });

    // if current user accept the assignment then remove that user from another assignment broadcast list
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
