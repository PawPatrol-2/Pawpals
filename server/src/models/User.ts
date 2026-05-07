import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  username: string;
  password: string;
  role: 'adopter' | 'organization';
  preferences?: {
    preferredAnimalType?: string;
    preferredMaxAge?: number;
    preferredPersonality?: string;
    housingType?: string;
    preferredChildFriendly?: boolean;
  };
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['adopter', 'organization', 'admin'],
    required: true,
  },
  preferences: {
    preferredAnimalType: { type: String, required: false },
    preferredMaxAge: { type: Number, required: false },
    preferredPersonality: { type: String, required: false },
    housingType: { type: String, required: false },
    preferredChildFriendly: { type: Boolean, required: false },
  },
});

export default mongoose.model<User>('User', UserSchema);
