import connectDb from "@/lib/db";
import DeliverAssignment from "@/models/deliveryAssignment";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await connectDb();
    const { orderId } = await params;
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
        role: "deliverBoy",
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
      const candidates = deliveryBoysPayload?.map((b: any) => String(b?._id));
      if (candidates.length === 0) {
        await order.save();
        return NextResponse.json(
          {
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
      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        _id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");
      // order.assignDeliveryBoy = deliveryAssignment.assignTo;
    }
    await order.save();
    await order.populate("user");
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
