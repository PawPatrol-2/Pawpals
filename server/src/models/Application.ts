import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  housingType: string;
  housingSize: number;
  hasAnimalExperience: boolean;
  hasChildren: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
  motivation: string;
  gdprConsent: boolean;
  status: "pending" | "reviewing" | "approved" | "rejected";
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  housingType: { type: String, required: true },
  housingSize: { type: Number, required: true },
  hasAnimalExperience: { type: Boolean, required: true },
  hasChildren: { type: Boolean, required: true },
  hasAllergies: { type: Boolean, required: true },
  allergyDetails: { type: String, required: true },
  motivation: { type: String, required: true },
  gdprConsent: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "reviewing", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);
