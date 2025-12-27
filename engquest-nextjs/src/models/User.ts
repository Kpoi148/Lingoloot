import mongoose from "mongoose";

export type UserRole = "admin" | "user";

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  image?: string;
};

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    image: { type: String, trim: true },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);

export default User;
