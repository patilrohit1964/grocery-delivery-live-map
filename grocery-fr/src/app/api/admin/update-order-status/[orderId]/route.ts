import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliverAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    await connectDb();
    const { orderId } = await context.params;
    const { status } = await req.json();
    const order = await Order.findById(orderId).populate(
      "user",
      "name mobile role image",
    );
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "order not found",
        },
        { status: 400 },
      );
    }
    order.status = status;
    let deliveryBoysPayload: any = [];
    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      // use this operator for live location tracking
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000,
          },
        },
      });
      const nearByIds = nearByDeliveryBoys.map((db) => db?._id);
      const busyIds = await DeliverAssignment.find({
        assignTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignTo"); //this distinct return particular field data only
      const busyIdSet = new Set(busyIds?.map((b) => b?.toString()));
      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (db) => !busyIdSet?.has(String(db?._id)),
      );
      const candidates = availableDeliveryBoys?.map((b: any) => String(b?._id));
      if (candidates.length === 0) {
        await order.save();
        return NextResponse.json(
          {
            success: false,
            message: "delivery boy not founds",
          },
          { status: 200 },
        );
      }
      const deliveryAssignment = await DeliverAssignment.create({
        order: order._id,
        broadcastTo: candidates,
        status: "broadcasted",
      });
      await deliveryAssignment.populate("order");
      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy.socketId) {
          emitEventHandler("new-assignment", deliveryAssignment, boy.socketId);
        }
      }
      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        _id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");
      order.assignDeliveryBoy = deliveryAssignment.assignTo;
    }
    await order.save();
    await order.populate("user");
    await emitEventHandler("order-status-update", {
      orderId: order?._id,
      status: order?.status,
    });
    return NextResponse.json(
      {
        success: true,
        message: "delivery boys",
        assignment: order.assignment?._id,
        available: deliveryBoysPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "something went wrong");
    return NextResponse.json({
      success: false,
      message: "server error",
    });
  }
}
