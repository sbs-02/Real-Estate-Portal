// src/models/Property.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  propertyType: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  listingType: 'sale' | 'rent';
  price: number;
  currency: string;
  status: 'active' | 'sold' | 'rented' | 'pending';
  location: {
    street: string;
    city: string;
    district: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqft' | 'sqm';
  floors?: number;
  yearBuilt?: number;
  amenities: {
    pool: boolean;
    gym: boolean;
    parking: boolean;
    elevator: boolean;
    security: boolean;
    furnished: 'yes' | 'no' | 'partial';
  };
  images: string[];
  virtualTourUrl?: string;
  listedBy: mongoose.Types.ObjectId;
  isFeatured: boolean;
  views: number;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'land', 'commercial'],
      required: true,
    },
    listingType: { type: String, enum: ['sale', 'rent'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['active', 'sold', 'rented', 'pending'],
      default: 'active',
    },
    location: {
      street: String,
      city: { type: String, required: true },
      district: String,
      state: String,
      country: { type: String, required: true },
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true },
    areaUnit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' },
    floors: Number,
    yearBuilt: Number,
    amenities: {
      pool: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      furnished: { type: String, enum: ['yes', 'no', 'partial'], default: 'no' },
    },
    images: [{ type: String }],
    virtualTourUrl: String,
    listedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for geo-queries and common filters
PropertySchema.index({ 'location.city': 1, listingType: 1, status: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IProperty>('Property', PropertySchema);