import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getAdminUser } from "@/lib/adminAuth";

export async function handleUploadImage(request: NextRequest) {
  try {
    // Only admins can upload product images
    const user = await getAdminUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        {
          status: 403,
        },
      );
    }

    // Read uploaded data sent from the frontend form
    const formData = await request.formData();
    const image = formData.get("image") as File;

    // Stop if no file was attached in the request
    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "No image provided",
        },
        {
          status: 400,
        },
      );
    }

    // Allow only image files and block everything else
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed",
        },
        {
          status: 400,
        },
      );
    }

    // Prevent very large uploads from being stored
    const MAX_SIZE = 2 * 1024 * 1024;

    // Reject files that exceed the allowed size limit
    if (image.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be smaller than 2MB",
        },
        {
          status: 400,
        },
      );
    }

    // Read the uploaded image into memory
    const bytes = await image.arrayBuffer();

    // Convert binary data into a format Cloudinary can accept
    const buffer = Buffer.from(bytes);
    const b64 = buffer.toString("base64");

    // Build a complete image string that can be uploaded directly
    const dataURI = `data:${image.type};base64,${b64}`;

    // Upload image to Cloudinary and store it inside the project folder
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "thinkit",
      resource_type: "auto",
    });

    // Send back the uploaded image URL for saving in the product record
    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);

    // Handle unexpected upload or Cloudinary errors
    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
