// Mongoose model that caches dictionary lookup responses for repeated words.
import mongoose from "mongoose";

export interface DictionaryCacheDocument {
  word: string;
  meaning: string;
  createdAt: Date;
}

const DictionaryCacheSchema = new mongoose.Schema<DictionaryCacheDocument>(
  {
    word: { type: String, required: true, lowercase: true, trim: true },
    meaning: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

DictionaryCacheSchema.index({ word: 1 }, { unique: true });
DictionaryCacheSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);

const DictionaryCache =
  (mongoose.models.DictionaryCache as mongoose.Model<DictionaryCacheDocument>) ||
  mongoose.model<DictionaryCacheDocument>(
    "DictionaryCache",
    DictionaryCacheSchema
  );

export default DictionaryCache;
