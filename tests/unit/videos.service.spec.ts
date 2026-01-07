import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from '../../src/modules/videos/videos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Video, VideoStatus } from '../../src/modules/videos/schemas/video.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageService } from '../../src/modules/storage/storage.service';
import { NotFoundException } from '@nestjs/common';

const mockVideo = {
  _id: 'video-id',
  title: 'Test Video',
  status: VideoStatus.PENDING,
  save: jest.fn(),
};

const mockVideoModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
  // We need to mock the constructor behavior for `new this.videoModel(...)`
};

// Mock the model class itself
class MockVideoModel {
  constructor(private data: any) {
    Object.assign(this, data);
  }
  save = jest.fn().mockResolvedValue({ ...this.data, _id: 'video-id' });
  static find = jest.fn();
  static findById = jest.fn();
  static findByIdAndUpdate = jest.fn();
}

const mockEventEmitter = {
  emit: jest.fn(),
};

const mockStorageService = {
  saveFile: jest.fn().mockResolvedValue('/path/to/file'),
};

describe('VideosService', () => {
  let service: VideosService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: getModelToken(Video.name),
          useValue: MockVideoModel,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    model = module.get(getModelToken(Video.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a video and emit an event', async () => {
      const file = { originalname: 'test.mp4', buffer: Buffer.from('') } as Express.Multer.File;
      const dto = { title: 'Test', creator: 'Me', genres: [] };

      const result = await service.create(file, dto);

      expect(mockStorageService.saveFile).toHaveBeenCalledWith(file);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('video.uploaded', expect.anything());
      expect(result).toBeDefined();
    });
  });

  describe('updateStatus', () => {
    it('should update video status', async () => {
        MockVideoModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue({ ...mockVideo, status: VideoStatus.ACTIVE }),
        });

        const result = await service.updateStatus('video-id', VideoStatus.ACTIVE);
        expect(result.status).toBe(VideoStatus.ACTIVE);
    });

    it('should throw NotFoundException if video not found', async () => {
        MockVideoModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.updateStatus('bad-id', VideoStatus.ACTIVE)).rejects.toThrow(NotFoundException);
    });
  });
});
