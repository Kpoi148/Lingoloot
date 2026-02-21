import mongoose from "mongoose";

export type PasswordResetTokenDocument = {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  requestedIp?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const PasswordResetTokenSchema = new mongoose.Schema<PasswordResetTokenDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true, trim: true },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date, default: null },
    requestedIp: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true }
);

PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
PasswordResetTokenSchema.index({ userId: 1, consumedAt: 1 });

const PasswordResetToken =
  (mongoose.models.PasswordResetToken as mongoose.Model<PasswordResetTokenDocument>) ||
  mongoose.model<PasswordResetTokenDocument>(
    "PasswordResetToken",
    PasswordResetTokenSchema
  );

export default PasswordResetToken;
