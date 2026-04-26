import connectDb from "@/lib/db";
import ChatRoom from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, deliveryBoyId, userId } = await req.json();
    let room = await ChatRoom.findOne({ orderId });
    // if room not found create new room
    if (!room) {
      room = await ChatRoom.create({
        orderId,
        deliveryBoyId,
        userId,
      });
    }
    return NextResponse.json(
      {
        success: true,
        message: "room created successfully",
        data: room,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      {
        success: false,
        message: "error while chat room creating",
      },
      { status: 500 },
    );
  }
}
