import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  email: string;
  username: string;
  password: string;
  role: "adopter" | "organization";
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["adopter", "organization"],
    required: true,
  },
});

export default mongoose.model<User>("User", UserSchema);
