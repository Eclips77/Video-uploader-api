import mongoose, { Schema, Document } from 'mongoose';

export interface IVideoModel extends Document {
  id: string;
  title: string;
  creator: string;
  description: string;
  targetAudience: string;
  language: string;
  genres: string[];
  uploadTime: string;
  filePath: string;
}

const VideoSchema: Schema = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  creator: { type: String, required: true },
  description: { type: String },
  targetAudience: { type: String },
  language: { type: String },
  genres: [{ type: String, ref: 'Genre' }], // Array of UUIDs
  uploadTime: { type: String, default: () => new Date().toISOString() },
  filePath: { type: String, required: true },
}, {
  toJSON: {
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Indexes for search
VideoSchema.index({ title: 'text', creator: 'text', description: 'text' });

export const VideoModel = mongoose.model<IVideoModel>('Video', VideoSchema);
