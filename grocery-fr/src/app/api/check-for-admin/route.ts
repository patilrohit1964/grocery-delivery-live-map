import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const users = await User.find({ role: "admin" });
    if (users.length > 0) {
      return NextResponse.json(
        {
          success: true,
          messgae: "admins found",
          adminExist: true,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          messgae: "not a admin",
          adminExist: false,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log(error, "erro");
  }
}
