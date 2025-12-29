import mongoose, { Schema, Document } from 'mongoose';

export interface IGenreModel extends Document {
  id: string; // public id (uuid)
  name: string;
}

const GenreSchema: Schema = new Schema({
  _id: { type: String, required: true }, // Use UUID as _id
  name: { type: String, required: true, unique: true },
}, {
  toJSON: {
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const GenreModel = mongoose.model<IGenreModel>('Genre', GenreSchema);
