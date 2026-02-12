import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId, latitude, longitude } = await req.json();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true, runValidators: true }, //To enable validation during update, we use
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "user not found",
          success: false,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        message: "location update successfully",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      {
        message: "something went wrong",
        success: false,
      },
      { status: 500 },
    );
  }
}
