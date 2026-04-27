import mongoose, { Schema, Document, Types } from "mongoose";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected"
  | "Inskickad"
  | "Granskas"
  | "Godkänd"
  | "Nekad"
  | "Behöver mer info";

export interface IApplication extends Document {
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
  userId: Types.ObjectId;
  animalId?: Types.ObjectId;
}

const ApplicationSchema = new Schema<IApplication>({
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
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  animalId: { type: Schema.Types.ObjectId, ref: "Animal", required: false },
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
      "Behöver mer info",
    ],
    default: "pending",
  },
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);
