import type { Request, Response } from "express";
import Property from "../models/Property.js";

/*
    Get all properties
*/
export const getProperties = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query: any = { status: "active" };
    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch properties" });
  }
};

/*
    Get single property
*/
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Could not get property error" });
  }
};
