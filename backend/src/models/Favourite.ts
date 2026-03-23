import mongoose, { Schema, Document } from "mongoose";

export interface IFavourite extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
}

const FavouriteSchema: Schema<IFavourite> = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
});

//Prevent duplicate favourites for the same user-property fair
FavouriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model<IFavourite>("Favourite", FavouriteSchema);
