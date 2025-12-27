import mongoose from "mongoose";

export interface VocabularyMedia {
  image?: string;
  video?: string;
  audio?: string;
}

export interface VocabularyDocument {
  word: string;
  ipa?: string;
  meaning: string;
  category_id: mongoose.Types.ObjectId;
  media?: VocabularyMedia;
  created_at?: Date;
}

const MediaSchema = new mongoose.Schema<VocabularyMedia>(
  {
    image: { type: String, trim: true },
    video: { type: String, trim: true },
    audio: { type: String, trim: true },
  },
  { _id: false }
);

const VocabularySchema = new mongoose.Schema<VocabularyDocument>(
  {
    word: { type: String, required: true, trim: true },
    ipa: { type: String, trim: true },
    meaning: { type: String, required: true, trim: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    media: { type: MediaSchema },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Vocabulary =
  (mongoose.models.Vocabulary as mongoose.Model<VocabularyDocument>) ||
  mongoose.model<VocabularyDocument>("Vocabulary", VocabularySchema);

export default Vocabulary;
