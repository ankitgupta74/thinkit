import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/jwt";
import { isAdminEmail } from "@/lib/adminAuth";
import { serverError } from "@/lib/apiError";

export async function handleLoginUser(request: NextRequest) {
  try {
    // Read email and password sent from the login form
    const body = await request.json();

    const { email, password } = body;

    // Stop early if required fields are missing
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide email and password",
        },
        {
          status: 400,
        },
      );
    }

    // Basic email format check before searching the database
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        {
          status: 400,
        },
      );
    }

    // Find user using a normalized (lowercase) email
    await connectDB();
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    // Compare entered password with the hashed password stored in DB
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    // Create a login token that identifies the user in future requests
    const token = generateToken(user._id.toString());

    // Prepare safe user data to send back to the frontend
    const userData = user.toObject();
    delete userData.password;

    // Determine whether this user should get admin access
    userData.isAdmin = isAdminEmail(userData.email);

    // Build the success response that will be sent to the client
    const response = NextResponse.json({
      success: true,
      user: userData,
    });

    // Store the login token in a secure cookie for future authentication
    response.cookies.set("token", token, {
      httpOnly: true, // Prevent JavaScript from reading the token
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Reduce risk of cross-site request attacks
      maxAge: 60 * 60 * 24 * 7, // Keep user logged in for 7 days
    });

    return response;
  } catch (error) {
    console.error(error);

    // Centralized server error handler for unexpected failures
    return serverError(error);
  }
}
