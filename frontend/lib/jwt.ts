import jwt from "jsonwebtoken";

// Secret key used to create and verify authentication tokens.
const JWT_SECRET = process.env.JWT_SECRET!;

// Creates a signed token after successful login.
export function generateToken(userId: string) {
  return jwt.sign(
    {
      // Store the user's ID inside the token.
      id: userId,
    },
    JWT_SECRET,
    {
      // User stays logged in for 7 days unless they log out.
      expiresIn: "7d",
    },
  );
}

// Confirms the token is valid and returns its stored data.
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
