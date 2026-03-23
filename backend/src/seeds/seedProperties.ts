import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { properties } from "./propertyData.js";

dotenv.config();

const seedProperties = async () => {
  await mongoose.connect(process.env.MONGO_URI!, {
    dbName: process.env.DB_NAME!,
  });
  console.log("Connected to DB");

  let agent = await User.findOne();
  if (!agent) {
    agent = await User.create({
      name: "Seed Agent",
      email: "agent@seed.com",
      password: "hashed_placeholder",
    });
  }

  await Property.deleteMany({});
  console.log("Cleared existing properties");

  await Property.insertMany(properties(agent._id));
  console.log("Seeded properties");

  await mongoose.disconnect();
};

seedProperties().catch(console.error);
