import mongoose, { Schema, Document, Types } from "mongoose";
import {
  decryptSensitiveValue,
  encryptSensitiveValue,
} from "../services/fieldEncryption";

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
  housingType?: string;
  housingSize?: number;
  hasAnimalExperience?: boolean;
  hasChildren?: boolean;
  hasAllergies?: boolean;
  allergyDetails?: string;
  motivation?: string;
  gdprConsent: boolean;
  status: ApplicationStatus;
  createdAt: Date;
  closedAt?: Date;
  anonymizedAt?: Date;
  anonymousApplicantId?: string;
  anonymizationReason?: "retention-expired" | "account-deleted";
  userId?: Types.ObjectId;
  animalId?: Types.ObjectId;
}

const ApplicationSchema = new Schema<IApplication>({
  animalNameSnapshot: { type: String, required: false },
  housingType: { type: String, required: true },
  housingSize: { type: Number, required: true },
  hasAnimalExperience: { type: Boolean, required: true },
  hasChildren: { type: Boolean, required: true },
  hasAllergies: { type: Boolean, required: true },
  allergyDetails: {
    type: String,
    required: false,
    set: encryptSensitiveValue,
    get: decryptSensitiveValue,
  },
  motivation: {
    type: String,
    required: true,
    set: encryptSensitiveValue,
    get: decryptSensitiveValue,
  },
  gdprConsent: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date, required: false },
  anonymizedAt: { type: Date, required: false, index: true },
  anonymousApplicantId: { type: String, required: false },
  anonymizationReason: {
    type: String,
    enum: ["retention-expired", "account-deleted"],
    required: false,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
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
}, {
  toJSON: { getters: true },
  toObject: { getters: true },
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);
