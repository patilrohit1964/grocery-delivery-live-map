import forgotPasswordEmailTemplate from "@/emails/forgot-password";
import connectDb from "@/lib/db";
import sendEmail from "@/lib/sendCode";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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
    const token = jwt.sign({ _id: existingUser._id }, process.env.AUTH_SECRET!);
    sendEmail(
      "Request for forgot password click on below link",
      email,
      forgotPasswordEmailTemplate(
        `http://localhost:3000/user/forgot-password/${token}`,
      ),
    );
    return NextResponse.json(
      {
        success: true,
        message: "Check your email",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: `something went wrong ${error}`,
      },
      {
        status: 500,
      },
    );
  }
}
