import mongoose, { model, Schema, Types } from 'mongoose';
import ServiceCountry from './service-countries.model';

export interface IUser extends mongoose.Document {
  username: string;
  bio: string;
  avatar: string;
  coverAvatar: string;
  email: string;
  password: string;
  emailVerified: boolean;
  dob: string;
  gender: string;
  country: Types.ObjectId;
  twoFAEnable: boolean;
  role: 'creator' | 'viewer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  bio: { type: String },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  coverAvatar: { type: String },
  emailVerified: { type: Boolean, default: false },
  dob: { type: String, required: true },
  gender: { type: String },
  country: {
    type: Schema.Types.ObjectId,
    ref: ServiceCountry,
    required: true,
  },
  twoFAEnable: { type: Boolean, default: false },
  role:     { type: String, enum: ['creator', 'viewer', 'admin'], default: 'viewer' },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});


const User = model<IUser>("User", userSchema);
export default User;