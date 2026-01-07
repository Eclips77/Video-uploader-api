import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type VideoDocument = Video & Document;

export enum VideoStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FAILED = 'FAILED',
}

@Schema({
  toJSON: {
    transform: (doc, ret: Record<string, any>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Video {
  @Prop({ type: String, default: uuidv4 })
  _id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  creator!: string;

  @Prop()
  description!: string;

  @Prop()
  targetAudience!: string;

  @Prop()
  language!: string;

  @Prop({ type: [String], ref: 'Genre' })
  genres!: string[];

  @Prop({ default: () => new Date().toISOString() })
  uploadTime!: string;

  @Prop({ required: true })
  filePath!: string;

  @Prop({ enum: VideoStatus, default: VideoStatus.PENDING })
  status!: VideoStatus;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
// Text indexes
VideoSchema.index({ title: 'text', creator: 'text', description: 'text' });
