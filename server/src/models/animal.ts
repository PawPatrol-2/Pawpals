import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
  type: { type: String, required: true },
  breed: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  keyTraits: { type: String, required: true },
});

export const Animal = mongoose.model("Animal", animalSchema);