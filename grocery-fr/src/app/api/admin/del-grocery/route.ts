import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "access denied only admin can access this route",
        },
        { status: 403 },
      );
    }
    const { id } = await req.json();
    await Grocery.findByIdAndDelete({ _id: id});
    return NextResponse.json(
      {
        success: true,
        message: "Grocery deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error || "something went wrong while deleting grocery",
      },
      { status: 500 },
    );
  }
}
