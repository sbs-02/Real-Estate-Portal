import express from "express";
import {
  addFavourite,
  getFavourites,
  removeFavourite,
  clearFavourites,
} from "../controllers/favouriteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: User favourite properties (requires authentication)
 */

/**
 * @swagger
 * /favourites:
 *   get:
 *     summary: Get all favourites for the logged-in user
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Array of favourite documents with populated property details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   propertyId:
 *                     $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Could not get favourites
 */
router.get("/", authMiddleware, getFavourites);

/**
 * @swagger
 * /favourites/{propertyId}:
 *   post:
 *     summary: Add a property to favourites
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the property to favourite
 *     responses:
 *       201:
 *         description: Property added to favourites
 *       400:
 *         description: Already in favourites or invalid ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Could not add favourite
 */
router.post("/:propertyId", authMiddleware, addFavourite);

/**
 * @swagger
 * /favourites/clear:
 *   delete:
 *     summary: Clear all favourites for the logged-in user
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All favourites cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All favourites cleared
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Could not clear favourites
 */
router.delete("/clear", authMiddleware, clearFavourites);

/**
 * @swagger
 * /favourites/{propertyId}:
 *   delete:
 *     summary: Remove a specific property from favourites
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the property to remove
 *     responses:
 *       200:
 *         description: Removed from favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Removed from favourites
 *       400:
 *         description: Invalid property ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Could not remove from favourites
 */
router.delete("/:propertyId", authMiddleware, removeFavourite);

export default router;
