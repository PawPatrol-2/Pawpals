import mongoose, { Document, Schema, Types } from "mongoose";

export const applicationStatuses = [
  "Inskickad",
  "Granskas",
  "Godkänd",
  "Nekad",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export interface ApplicationDocument extends Document {
  userId: Types.ObjectId;
  animalId: Types.ObjectId;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<ApplicationDocument>(
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
    },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "Inskickad",
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model<ApplicationDocument>(
  "Application",
  applicationSchema
);

export default Application;
