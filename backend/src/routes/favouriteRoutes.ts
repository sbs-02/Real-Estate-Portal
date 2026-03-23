import express from "express";
import {
  addFavourite,
  getFavourites,
  removeFavourite,
  clearFavourites,
} from "../controllers/favouriteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:propertyId", authMiddleware, addFavourite);
router.get("/", authMiddleware, getFavourites);
router.delete("/clear", authMiddleware, clearFavourites);
router.delete("/:propertyId", authMiddleware, removeFavourite);


export default router;
