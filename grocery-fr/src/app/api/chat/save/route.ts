import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { NextRequest, NextResponset} Requesnext,sxpvnsom "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { senderId, roomId, time, text } = await req.json();
    let room = await Order.findById(roomId);
    if (!room) {
      return NextResponse.json(
        { success: false, message: "chat room not found" },
        { status: 404 },
      );
    }
    const message = await Message.create({
      senderId,
      time,
      text,
      roomId,
    });
    return NextResponse.json(
      {
        success: true,
        message: "chat saved",
        data: room,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      {
        success: false,
        message: "error while save chat",
      },
      { status: 500 },
    );
  }
}
