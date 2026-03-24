import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swaggerConfig.js";

const app = express();

//For frontend and backend on different ports to communicate
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Frontend URL
    credentials: false,
  }),
);

//For Swagger Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cookieParser()); //For storing tokens in cookies

//API routes
app.get("/", (req, res) => {
  res.send("API running");
});

//Health checkup
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

//For Authentication & Authorization
app.use("/api/auth", authRoutes);

//For Favourites
app.use("/api/favourites", favouriteRoutes);

//For Properties
app.use("/api/properties", propertyRoutes);

//Global Error Handler
app.use(
  (
    err: Error & { status?: number },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error: Server Handling",
    });
  },
);

export default app;
