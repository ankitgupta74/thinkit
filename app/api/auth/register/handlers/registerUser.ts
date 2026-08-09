import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/jwt";
import { isAdminEmail } from "@/lib/adminAuth";
import { serverError } from "@/lib/apiError";

export async function handleRegisterUser(request: NextRequest) {
  try {
    // Read registration details sent from the signup form
    const body = await request.json();

    const { name, email, password } = body;

    // Stop registration if any required field is missing
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        {
          status: 400,
        },
      );
    }

    // Basic email format check before creating an account
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

    // Enforce a minimum password length for better account security
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        {
          status: 400,
        },
      );
    }

    // Connect before checking or creating user records
    await connectDB();

    // Prevent multiple accounts from using the same email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        {
          status: 400,
        },
      );
    }

    // Never store raw passwords in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign admin privileges if the email is listed as an admin email
    const adminStatus = isAdminEmail(email);

    // Create the new user record with cleaned and secure data
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: adminStatus,
    });

    // Create a login token so the user is signed in immediately after registration
    const token = generateToken(user._id.toString());

    // Prepare safe user data before sending it to the frontend
    const userData = user.toObject();
    delete userData.password;
    userData.isAdmin = adminStatus;

    // Build the success response for the newly registered user
    const response = NextResponse.json({
      success: true,
      user: userData,
    });

    // Store the authentication token in a secure cookie
    response.cookies.set("token", token, {
      httpOnly: true, // Prevent frontend JavaScript from reading the token

      secure: process.env.NODE_ENV === "production", // HTTPS only in production

      sameSite: "strict", // Helps reduce cross-site request attacks

      maxAge: 60 * 60 * 24 * 30, // Keep user logged in for 30 days
    });

    return response;
  } catch (error) {
    console.error(error);

    // Handle unexpected server errors in one place
    return serverError(error);
  }
}
