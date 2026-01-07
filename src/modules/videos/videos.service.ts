import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument, VideoStatus } from './schemas/video.schema';
import { CreateVideoDto } from './dto/create-video.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageService } from '../storage/storage.service';
import { VideoUploadedEvent } from './events/video-uploaded.event';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    private eventEmitter: EventEmitter2,
    private storageService: StorageService,
  ) {}

  async create(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<Video> {
    const filePath = await this.storageService.saveFile(file);

    const createdVideo = new this.videoModel({
      ...createVideoDto,
      filePath,
      status: VideoStatus.PENDING,
    });

    const savedVideo = await createdVideo.save();

    this.eventEmitter.emit(
      'video.uploaded',
      new VideoUploadedEvent(savedVideo._id, filePath),
    );

    return savedVideo;
  }

  async findAll(): Promise<Video[]> {
    return this.videoModel.find().exec();
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.videoModel.findById(id).exec();
    if (!video) throw new NotFoundException(`Video with ID ${id} not found`);
    return video;
  }

  async updateStatus(id: string, status: VideoStatus): Promise<Video> {
    const video = await this.videoModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).exec();
    if (!video) throw new NotFoundException(`Video with ID ${id} not found`);
    return video;
  }
}
