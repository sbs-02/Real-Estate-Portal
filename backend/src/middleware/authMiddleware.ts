import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/AuthRequest.js";
import jwt from "jsonwebtoken";

/*
  Handles authorization / protection of routes
*/
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    let token = req.cookies.accessToken;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_ACCESS_SECRET as string,
    ) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = { id: decoded.id, email: decoded.email };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
