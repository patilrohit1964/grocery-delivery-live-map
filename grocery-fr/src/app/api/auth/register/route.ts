import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { name, email, password } = await req.json();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists",
          success: false,
        },
        { status: 400 },
      );
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPass });
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          id: newUser?._id,
          name: newUser?.name,
          email: newUser?.email,
          role: newUser?.role,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error);
  }
}
