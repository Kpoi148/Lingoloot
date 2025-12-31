import mongoose from "mongoose";

export interface CategoryDocument {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  order: number;
  count?: number;
  lastContentUpdatedAt?: Date;
}

const CategorySchema = new mongoose.Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image_url: { type: String, trim: true },
    order: { type: Number, required: true, default: 0 },
    count: { type: Number, min: 0 },
    lastContentUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Category =
  (mongoose.models.Category as mongoose.Model<CategoryDocument>) ||
  mongoose.model<CategoryDocument>("Category", CategorySchema);

export default Category;
