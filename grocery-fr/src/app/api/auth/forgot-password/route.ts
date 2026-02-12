import connectDb from "@/lib/db";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { password, token } = await req.json();
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!);
    console.log(decoded, "decoded");
    const user = await User.findById(decoded._id);
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "User not found",
        },
        {
          status: 400,
        },
      );
    }
    user.password = password;
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
  }
}
