import mongoose, { Schema, Document } from "mongoose";

export type NotificationType =
  | "application-created"
  | "application-status-updated";

export interface NotificationDocument extends Document {
  recipientUserId: string;
  type: NotificationType;
  applicationId: string;
  title: string;
  message: string;
  targetUrl: string;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    recipientUserId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["application-created", "application-status-updated"],
      required: true,
      index: true,
    },
    applicationId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetUrl: { type: String, required: true },
    readAt: { type: Date, required: false, default: null, index: true },
  },
  { timestamps: true },
);

NotificationSchema.index(
  { recipientUserId: 1, type: 1, applicationId: 1 },
  { unique: true },
);

export default mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema,
);
