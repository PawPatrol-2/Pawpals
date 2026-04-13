import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
  type: { type: String, required: true },
  breed: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  keyTraits: { type: String, required: true },
  personality: { type: String, required: false },
  description: { type: String, required: false },
  organizationOwner: { type: String, required: false },
  likes: { type: [String], required: false },
});

export const Animal = mongoose.model("Animal", animalSchema);
