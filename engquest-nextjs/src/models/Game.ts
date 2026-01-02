import mongoose from "mongoose";

export type GameContentItem = {
  text: string;
  type: "text" | "gap";
  answer?: string;
};

export type GameStatus = "draft" | "active";

export interface GameDocument {
  title: string;
  topicName: string;
  status: GameStatus;
  content: GameContentItem[];
  distractors: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const GameContentSchema = new mongoose.Schema<GameContentItem>(
  {
    text: { type: String, required: true, trim: true },
    type: { type: String, enum: ["text", "gap"], required: true },
    answer: { type: String, trim: true },
  },
  { _id: false }
);

const GameSchema = new mongoose.Schema<GameDocument>(
  {
    title: { type: String, required: true, trim: true },
    topicName: { type: String, required: true, trim: true },
    status: { type: String, enum: ["draft", "active"], default: "draft" },
    content: { type: [GameContentSchema], required: true },
    distractors: { type: [String], default: [] },
  },
  { timestamps: true }
);

GameSchema.index({ status: 1, createdAt: -1 });
GameSchema.index({ topicName: 1, createdAt: -1 });

const Game =
  (mongoose.models.Game as mongoose.Model<GameDocument>) ||
  mongoose.model<GameDocument>("Game", GameSchema);

export default Game;
