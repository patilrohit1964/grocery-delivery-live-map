import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliverAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDb();
    const { id } = await params;
    const session = await auth();
    const deliveryBoy = session?.user?.id;
    if (!deliveryBoy) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        { status: 401 },
      );
    }
    const assignment = await DeliverAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "assignment not found",
        },
        { status: 400 },
      );
    }
    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        {
          success: false,
          message: "assignment already accepted",
        },
        { status: 400 },
      );
    }
    
  } catch (error) {
    console.log(error, "error while accepting assignments");
  }
}
