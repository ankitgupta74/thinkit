import "dotenv/config";
import "./bootstrap";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

import { products } from "./data/products";

async function seedProducts() {
  try {
    await connectDB();

    console.log("Connected");

    await Product.deleteMany({});

    console.log("Old products removed");

    await Product.insertMany(products);

    console.log(`${products.length} products inserted`);

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

seedProducts();
