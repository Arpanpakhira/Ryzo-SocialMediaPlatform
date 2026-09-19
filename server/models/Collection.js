import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true }, // Clerk user ID or user ID
    name: { type: String, required: true },
    cover_image: { type: String, default: '' },
    posts: [{ type: String }], // Array of Post IDs saved in this collection
  },
  { timestamps: true }
);

export const Collection = mongoose.model('Collection', collectionSchema);
