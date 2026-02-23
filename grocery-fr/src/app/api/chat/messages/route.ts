import connectDb from "@/lib/db";
import ChatRoom from "@/models/chat.model";
import Message from "@/models/message.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { roomId } = await req.json();
    let room = await Message.findById(roomId);
    // if room not found create new room
    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "room not found",
        },
        { status: 400 },
      );
    }
    const messages = await Message.find({ roomId: room._id });
    return NextResponse.json(
      {
        success: true,
        message: "messages fetched",
        data: messages,
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
