import mongoose, { Schema, Document, Types } from "mongoose";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected"
  | "Inskickad"
  | "Granskas"
  | "Godkänd"
  | "Nekad";

export interface IApplication extends Document {
  userId: Types.ObjectId;
  animalId?: Types.ObjectId;
  animalNameSnapshot?: string;
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
}

const ApplicationSchema = new Schema<IApplication>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  animalId: { type: Schema.Types.ObjectId, ref: "Animal", required: false },
  animalNameSnapshot: { type: String, required: false },
  housingType: { type: String, required: true },
  housingSize: { type: Number, required: true },
  hasAnimalExperience: { type: Boolean, required: true },
  hasChildren: { type: Boolean, required: true },
  hasAllergies: { type: Boolean, required: true },
  allergyDetails: { type: String, required: false },
  motivation: { type: String, required: true },
  gdprConsent: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
      "pending",
      "reviewing",
      "approved",
      "rejected",
      "Inskickad",
      "Granskas",
      "Godkänd",
      "Nekad",
    ],
    default: "pending",
  },
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);
