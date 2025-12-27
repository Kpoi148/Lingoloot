import mongoose from "mongoose";

export interface QuizResultDocument {
  user_id: mongoose.Types.ObjectId;
  quiz_id: mongoose.Types.ObjectId;
  score: number;
  total_questions: number;
  completed_at: Date;
}

const QuizResultSchema = new mongoose.Schema<QuizResultDocument>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true, min: 0 },
    total_questions: { type: Number, required: true, min: 1 },
    completed_at: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const QuizResult =
  (mongoose.models.QuizResult as mongoose.Model<QuizResultDocument>) ||
  mongoose.model<QuizResultDocument>("QuizResult", QuizResultSchema);

export default QuizResult;
