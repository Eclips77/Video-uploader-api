import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PlaylistDocument = Playlist & Document;

@Schema({
  toJSON: {
    transform: (doc, ret: Record<string, any>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Playlist {
  @Prop({ type: String, default: uuidv4 })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: [String], ref: 'Video' })
  videoIds!: string[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
