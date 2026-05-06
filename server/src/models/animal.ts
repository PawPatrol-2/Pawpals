import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    breed: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: false },
    keyTraits: { type: String, required: false },
    personality: { type: String, required: false },
    description: { type: String, required: false },
    city: { type: String, required: true },
    childFriendly: { type: Boolean, required: false, default: false },
    organizationOwner: { type: String, required: false },
    likes: { type: [String], required: false },
  },
  { timestamps: true },
);

export const Animal = mongoose.model("Animal", animalSchema);
