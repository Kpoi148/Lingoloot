import mongoose from "mongoose";

export interface QuizQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
}

export interface QuizDocument {
  title: string;
  category?: string;
  level?: string;
  timeLimit?: number;
  questions: QuizQuestion[];
  createdAt?: Date;
  updatedAt?: Date;
}

const QuizQuestionSchema = new mongoose.Schema<QuizQuestion>(
  {
    question_text: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correct_answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const QuizSchema = new mongoose.Schema<QuizDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    level: {
      type: String,
      trim: true,
      enum: ["Cơ bản", "Trung bình", "Khó"],
      default: "Trung bình",
    },
    timeLimit: { type: Number, min: 30, max: 3600, default: 120 },
    questions: { type: [QuizQuestionSchema], required: true },
  },
  { timestamps: true }
);

const Quiz =
  (mongoose.models.Quiz as mongoose.Model<QuizDocument>) ||
  mongoose.model<QuizDocument>("Quiz", QuizSchema);

export default Quiz;
