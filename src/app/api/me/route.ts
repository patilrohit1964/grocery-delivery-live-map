import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const session = await auth();
    if (!session && !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "user is not authenticated",
        },
        { status: 400 },
      );
    }
    const user=await User.findOne
  } catch (error) {
    console.log(`get me: ${error}`);
  }
}
