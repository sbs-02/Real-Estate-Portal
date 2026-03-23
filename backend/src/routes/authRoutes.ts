import express from "express";
import {
  login,
  register,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
