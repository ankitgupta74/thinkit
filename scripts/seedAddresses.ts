import "dotenv/config";
import "./bootstrap";

import User from "@/models/User";
import Address from "@/models/Address";
import { connectDB } from "@/lib/mongodb";


async function seedAddresses() {
  try {
    await connectDB();

    console.log("Connected");

    await Address.deleteMany({});

    console.log("Old addresses removed");

    const users = await User.find().sort({
      createdAt: 1,
    });
    console.log("Users Found:", users.length);

    const addresses = [];

    const admin = users.find(
      (user) => user.email === "ankit24032004@gmail.com",
    );

    if (admin) {
      addresses.push(
        {
          label: "Home",
          address: "123 Main Street",
          city: "Kolkata",
          state: "West Bengal",
          zip: "700001",
          isDefault: true,
          lat: 22.5726,
          lng: 88.3639,
          user: admin._id,
        },

        {
          label: "Work",
          address: "Salt Lake Sector V",
          city: "Kolkata",
          state: "West Bengal",
          zip: "700091",
          isDefault: false,
          lat: 22.5697,
          lng: 88.4335,
          user: admin._id,
        },
      );
    }

    const user1 = users.find((user) => user.email === "user1@test.com");

    if (user1) {
      addresses.push(
        {
          label: "Home",
          address: "User 1 Home",
          city: "Delhi",
          state: "Delhi",
          zip: "110001",
          isDefault: true,
          lat: 28.6139,
          lng: 77.209,
          user: user1._id,
        },

        {
          label: "Work",
          address: "User 1 Office",
          city: "Delhi",
          state: "Delhi",
          zip: "110002",
          isDefault: false,
          lat: 28.7041,
          lng: 77.1025,
          user: user1._id,
        },
      );
    }

    const user2 = users.find((user) => user.email === "user2@test.com");

    if (user2) {
      addresses.push(
        {
          label: "Home",
          address: "User 2 Home",
          city: "Mumbai",
          state: "Mumbai",
          zip: "400001",
          isDefault: true,
          lat: 18.9220,
          lng: 72.8347,
          user: user2._id,
        },

        {
          label: "Work",
          address: "User 2 Office",
          city: "Mumbai",
          state: "Mumbai",
          zip: "400058",
          isDefault: false,
          lat: 19.0896,
          lng: 72.8656,
          user: user2._id,
        },
      );
    }

    const remainingUsers = users.filter(
      (user) =>
        ![
          "ankit24032004@gmail.com",
          "user1@test.com",
          "user2@test.com",
        ].includes(user.email),
    );
    remainingUsers.forEach((user, index) => {
      addresses.push({
        label: "Home",
        address: `House ${index + 1}`,
        city: "Kolkata",
        state: "West Bengal",
        zip: `7000${index + 10}`,
        isDefault: true,
        lat: 22.5726,
        lng: 88.3639,
        user: user._id,
      });
    });

    await Address.insertMany(addresses);

    console.log(`${addresses.length} addresses inserted`);
    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }  
}

seedAddresses();
