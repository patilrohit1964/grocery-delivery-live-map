import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
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
    const formData = await req.formData();
    const id = formData.get("_id") as string;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const image = formData.get("image") as Blob | null;
    let imageUrl;
    if (image) {
      imageUrl = await uploadOnCloudinary(image);
    }
    const updateGrocery = await Grocery.findByIdAndUpdate(
      { _id: id },
      {
        name,
        category,
        price,
        unit,
        image: imageUrl,
      },
    );
    return NextResponse.json(
      {
        success: true,
        message: "Grocery Update Successfully",
        data: updateGrocery,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error || "something went wrong",
      },
      { status: 201 },
    );
  }
}
