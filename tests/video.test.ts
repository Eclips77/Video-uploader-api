import request from 'supertest';
import { app } from '../src/app';
import fs from 'fs-extra';
import path from 'path';

// Mock ffmpeg to avoid actual encoding during tests
jest.mock('../src/infrastructure/encoding/EncodingService', () => {
    return {
        EncodingService: jest.fn().mockImplementation(() => {
            return {
                processVideo: jest.fn().mockResolvedValue('storage/videos/mock-video.mp4')
            };
        })
    };
});

describe('Video API', () => {
  let genreId: string;
  let videoId: string;

  beforeAll(async () => {
      // Create a genre first
      const res = await request(app).post('/api/genres').send({ name: 'Sci-Fi' });
      genreId = res.body.data.id;
  });

  it('should create a video', async () => {
    // We need to attach a file.
    // Create a dummy file
    const dummyFilePath = path.join(__dirname, 'dummy.mp4');
    await fs.writeFile(dummyFilePath, 'dummy content');

    const res = await request(app)
      .post('/api/videos')
      .field('title', 'Test Video')
      .field('creator', 'Tester')
      .field('description', 'A test video')
      .field('targetAudience', 'General')
      .field('language', 'en')
      .field('genres', genreId)
      .attach('video', dummyFilePath, { contentType: 'video/mp4' });

    // Clean up dummy
    await fs.remove(dummyFilePath);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Video');
    videoId = res.body.data.id;
  });

  it('should get all videos', async () => {
      const res = await request(app).get('/api/videos');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should search videos', async () => {
      const res = await request(app).get('/api/videos?q=Test');
      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe('Test Video');
  });

  it('should update video metadata', async () => {
      const res = await request(app)
        .put(`/api/videos/${videoId}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
  });

  it('should delete video', async () => {
      const res = await request(app).delete(`/api/videos/${videoId}`);
      expect(res.status).toBe(200);
  });
});
