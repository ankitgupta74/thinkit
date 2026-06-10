import "dotenv/config";
import "./bootstrap";
import bcrypt from "bcryptjs";

import DeliveryPartner from "@/models/DeliveryPartner";
import { connectDB } from "@/lib/mongodb";

async function seedDeliveryPartners() {
  try {
    await connectDB();

    console.log("Connected");

    await DeliveryPartner.deleteMany({});

    console.log("Old delivery partners removed");

    const riderPassword = await bcrypt.hash("Rider@123", 10);

    const vehicleTypes = ["bike", "scooter", "car"];

    const riders = [
      ...Array.from({ length: 10 }, (_, index) => ({
        name: `Rider ${index + 1}`,
        email: `rider${index + 1}@test.com`,
        password: riderPassword,
        phone: `80000000${String(index + 1).padStart(2, "0")}`, // Fixes phone number formatting
        vehicleType:
          vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        isActive: Math.random() < 0.7, // 70% chance true, 30% false
      })),
    ];

    await DeliveryPartner.insertMany(riders);

    console.log(`${riders.length} riders inserted`);

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

seedDeliveryPartners();
