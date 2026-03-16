import { NextRequest, NextResponse } from "next/server";

export async function PUt(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log(payload, "payload");
    return NextResponse.json({
      message: "grocery edit",
      success: true,
    });
  } catch (error) {
    console.log(error, "error while edit grocery");
  }
}
