import type { Response } from "express";
import Favourite from "../models/Favourite.js";
import Property from "../models/Property.js";
import type { AuthRequest } from "../types/AuthRequest.js";
import mongoose from "mongoose";

/*
    Add a favourite
*/
export const addFavourite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId) {
      res.status(400).json({ message: "Property ID is required" });
      return;
    }

    const existingFavourite = await Favourite.findOne({
      userId: new mongoose.Types.ObjectId(req.user!.id),
      propertyId: new mongoose.Types.ObjectId(propertyId as string),
    });

    if (existingFavourite) {
      res.status(400).json({ message: "Property already in favourites" });
      return;
    }

    const favourite = await Favourite.create({
      userId: new mongoose.Types.ObjectId(req.user!.id),
      propertyId: new mongoose.Types.ObjectId(propertyId as string),
    });

    const populatedFavourite = await favourite.populate("propertyId");
    res.status(201).json(populatedFavourite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not add favourite" });
  }
};

/*
    Get favourites
*/
export const getFavourites = async (req: AuthRequest, res: Response) => {
  try {
    const favourites = await Favourite.find({
      userId: new mongoose.Types.ObjectId(req.user!.id),
    }).populate("propertyId");
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ message: "Could not get favourites" });
  }
};

/*
    Remove a favourite
*/
export const removeFavourite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId) {
      res.status(400).json({ message: "Property ID is required" });
      return;
    }

    await Favourite.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(req.user!.id),
      propertyId: new mongoose.Types.ObjectId(propertyId as string),
    });
    res.json({ message: "Removed from favourites" });
  } catch (error) {
    res.status(500).json({ message: "Could not remove from favourites" });
  }
};

/*
    Clear favourites
*/
export const clearFavourites = async (req: AuthRequest, res: Response) => {
  try {
    await Favourite.deleteMany({
      userId: new mongoose.Types.ObjectId(req.user!.id),
    });
    res.json({ message: "All favourites cleared" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not clear all favourites" });
  }
};
