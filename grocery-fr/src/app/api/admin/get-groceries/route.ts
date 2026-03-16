import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const groceries = await Grocery.find();
    return NextResponse.json(
      {
        message: "Fetched Groceries",
        data: groceries,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error while get groceries");
    return NextResponse.json(
      {
        message: "server error",
        success: false,
      },
      { status: 500 },
    );
  }
}
