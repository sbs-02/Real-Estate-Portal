import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB()
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => console.log("MONGODB connection fail: ", err));

  app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
  });
};

startServer();
