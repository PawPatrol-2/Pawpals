import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    email: string;
    username: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

export default mongoose.model<User>("User", UserSchema);
