// Mongoose model that defines learners, admins, and gamification-related user fields.
import mongoose from "mongoose";

export type UserRole = "admin" | "user";

export type UserGamification = {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: Date | null;
  currency: number;
  inventory: string[];
  equippedFrame?: string;
  equippedAvatar?: string;
};

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  gamification?: UserGamification;
  isBanned?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  image?: string;
  avatarUrl?: string;
  displayName?: string;
  bio?: string;
  stats?: {
    totalVocabAdded: number;
    quizzesTaken: number;
    quizAccuracy: number;
  };
};

const GamificationSchema = new mongoose.Schema<UserGamification>(
  {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null },
    currency: { type: Number, default: 0 },
    inventory: { type: [String], default: [] },
    equippedFrame: { type: String },
    equippedAvatar: { type: String },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gamification: { type: GamificationSchema, default: () => ({}) },
    isBanned: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    image: { type: String, trim: true },
    avatarUrl: { type: String, trim: true, default: "/logo.png" },
    displayName: { type: String, trim: true },
    bio: { type: String, trim: true },
    stats: {
      totalVocabAdded: { type: Number, default: 0 },
      quizzesTaken: { type: Number, default: 0 },
      quizAccuracy: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);

export default User;
