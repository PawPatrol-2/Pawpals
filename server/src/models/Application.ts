import mongoose, { Schema, Document, Types } from "mongoose";

export const applicationStatuses = [
  "Inskickad",
  "Granskas",
  "Godkänd",
  "Nekad",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export interface IApplication extends Document {
  userId: Types.ObjectId;
  animalId: Types.ObjectId;
  housingType: string;
  housingSize: number;
  hasAnimalExperience: boolean;
  hasChildren: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
  motivation: string;
  gdprConsent: boolean;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    animalId: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
      index: true,
    },
    housingType: { type: String, required: true },
    housingSize: { type: Number, required: true },
    hasAnimalExperience: { type: Boolean, required: true },
    hasChildren: { type: Boolean, required: true },
    hasAllergies: { type: Boolean, required: true },
    allergyDetails: { type: String, default: "" },
    motivation: { type: String, required: true },
    gdprConsent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "Inskickad",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
