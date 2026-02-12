import forgotPasswordEmailTemplate from "@/emails/forgot-password";
import connectDb from "@/lib/db";
import sendEmail from "@/lib/sendCode";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { email } = await req.json();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: "Credentials not found with this email",
          success: false,
        },
        { status: 400 },
      );
    }
    sendEmail(
      "Request for forgot password click on below link",
      email,
      forgotPasswordEmailTemplate(`http://localhost:3000/`),
    );
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
  }
}
