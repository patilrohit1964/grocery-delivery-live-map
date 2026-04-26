import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await context.params;
    const order = await Order.findById(orderId).populate(
      "assignDeliveryBoy",
      "name email mobile image location",
    );
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "order not found with this id",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "order fetched",
        data: order,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "while fetching order details");
    return NextResponse.json(
      {
        success: false,
        message: "order details fetching failed",
      },
      { status: 500 },
    );
  }
}
