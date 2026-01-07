import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type GenreDocument = Genre & Document;

@Schema({
  toJSON: {
    transform: (doc, ret: Record<string, any>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Genre {
  @Prop({ type: String, default: uuidv4 })
  _id!: string;

  @Prop({ required: true, unique: true })
  name!: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
