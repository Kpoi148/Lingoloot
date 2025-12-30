import mongoose from "mongoose";

export type UserRole = "admin" | "user";

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
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

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
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
