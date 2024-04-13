import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    likes: [{ type: ObjectId, ref: 'USER' }],
    comments: [
      {
        comment: { type: String },
        postedBy: { type: ObjectId, ref: 'USER' },
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Post', postSchema);
