import "dotenv/config";
import "./bootstrap";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

async function seedUsers() {
  try {
    await connectDB();

    console.log("Connected");

    await User.deleteMany({});

    console.log("Old users removed");

    const adminPassword = await bcrypt.hash("Admin@123", 10);

    const userPassword = await bcrypt.hash("User@123", 10);

    const users = [
      {
        name: "Ankit Admin",
        email: "ankit24032004@gmail.com",
        password: adminPassword,
        phone: "9999999999",
        avatar: "",
        isAdmin: true,
      },

      ...Array.from({ length: 10 }, (_, index) => ({
        name: `User ${index + 1}`,
        email: `user${index + 1}@test.com`,
        password: userPassword,
        phone: `900000000${index + 1}`,
        avatar: "",
        isAdmin: false,
      })),
    ];

    await User.insertMany(users);

    console.log(`${users.length} users inserted`);

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

seedUsers();
