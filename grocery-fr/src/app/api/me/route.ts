import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "user is not authenticated",
        },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email: session?.user?.email }).select(
      "-password",
    );
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "User Details Fetched",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(`get me: ${error}`);
  }
}
