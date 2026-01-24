import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

// MONGODB_URI check moved to connectToDatabase

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    if (process.env.MONGODB_URI) {
      // logic to handle late env loading if needed, or just re-read
    }
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Please define the MONGODB_URI environment variable.");

    if (cached.conn) return cached.conn;
    if (!cached.promise) {
      cached.promise = mongoose.connect(uri, { bufferCommands: false });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
