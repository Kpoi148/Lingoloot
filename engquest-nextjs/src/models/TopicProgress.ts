import mongoose from "mongoose";

export interface TopicProgressDocument {
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  vocab_completed: boolean;
  quiz_completed: boolean;
  updated_at: Date;
}

const TopicProgressSchema = new mongoose.Schema<TopicProgressDocument>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    vocab_completed: { type: Boolean, default: false },
    quiz_completed: { type: Boolean, default: false },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

TopicProgressSchema.index({ user_id: 1, category_id: 1 }, { unique: true });

const TopicProgress =
  (mongoose.models.TopicProgress as mongoose.Model<TopicProgressDocument>) ||
  mongoose.model<TopicProgressDocument>("TopicProgress", TopicProgressSchema);

export default TopicProgress;
