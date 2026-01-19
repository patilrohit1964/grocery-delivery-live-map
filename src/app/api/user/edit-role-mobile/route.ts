import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { role, mobile } = await req.json();
    const session = await auth();
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      { role, mobile },
    );
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found with this email",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Details updated",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "something went wrong during mobile and role update",
      },
      { status: 500 },
    );
  }
}
