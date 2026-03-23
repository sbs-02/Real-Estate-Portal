import mongoose from "mongoose";

const connectDB = async () => {
  console.log("PORT", process.env.DB_NAME, process.env.MONGO_URI);
  console.log("port ok");
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: process.env.DB_NAME!,
    });

    console.log(`MongoDb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("ERROR", process.env.MONGO_URI);
    console.log(`Error: ${error}`);
    process.exit(1); //stop server if DB connection fails
  }
};
export default connectDB;
