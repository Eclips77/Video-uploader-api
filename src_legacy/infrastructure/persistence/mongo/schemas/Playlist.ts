import mongoose, { Schema, Document } from 'mongoose';

export interface IPlaylistModel extends Document {
  id: string;
  name: string;
  videoIds: string[];
}

const PlaylistSchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  videoIds: [{ type: String, ref: 'Video' }],
}, {
  toJSON: {
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const PlaylistModel = mongoose.model<IPlaylistModel>('Playlist', PlaylistSchema);
