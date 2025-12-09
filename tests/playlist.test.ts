import request from 'supertest';
import { app } from '../src/app';

// Mock ffmpeg
jest.mock('../src/infrastructure/encoding/EncodingService', () => {
    return {
        EncodingService: jest.fn().mockImplementation(() => {
            return {
                processVideo: jest.fn().mockResolvedValue('storage/videos/mock-video.mp4')
            };
        })
    };
});

describe('Playlist API', () => {
  let videoId1: string;
  let videoId2: string;
  let genreId: string;
  let playlistId: string;

  beforeAll(async () => {
      // Create Genre
      const genreRes = await request(app).post('/api/genres').send({ name: 'Playlist Genre' });
      genreId = genreRes.body.data.id;

      // Create Videos (mocking upload via direct repository or service usage would be faster but let's use endpoint with mocked busboy/ffmpeg logic implicit)
      // Actually, since I mocked EncodingService, I can use the endpoint.
      // Need dummy file though.
      // Using a simpler approach: Mock the VideoService?
      // No, let's just use the endpoint with a dummy file as in video.test.ts, but we need the file to exist.
      // Alternatively, insert directly into JSON file?
      // I'll stick to endpoints to test integration.

      const fs = require('fs-extra');
      const path = require('path');
      const dummyFilePath = path.join(__dirname, 'dummy_p.mp4');
      await fs.writeFile(dummyFilePath, 'dummy content');

      const v1 = await request(app).post('/api/videos').field('title', 'V1').field('creator','C').field('description','D').field('targetAudience','T').field('language','L').field('genres', genreId).attach('video', dummyFilePath, { contentType: 'video/mp4' });
      videoId1 = v1.body.data.id;

      const v2 = await request(app).post('/api/videos').field('title', 'V2').field('creator','C').field('description','D').field('targetAudience','T').field('language','L').field('genres', genreId).attach('video', dummyFilePath, { contentType: 'video/mp4' });
      videoId2 = v2.body.data.id;

      await fs.remove(dummyFilePath);
  });

  it('should create a playlist', async () => {
      const res = await request(app)
        .post('/api/playlists')
        .send({ name: 'My Playlist', videoIds: [videoId1] });

      expect(res.status).toBe(201);
      expect(res.body.data.videoIds).toContain(videoId1);
      playlistId = res.body.data.id;
  });

  it('should add a video to playlist', async () => {
      const res = await request(app)
        .put(`/api/playlists/${playlistId}`)
        .send({ addVideoIds: [videoId2] });

      expect(res.status).toBe(200);
      expect(res.body.data.videoIds).toContain(videoId1);
      expect(res.body.data.videoIds).toContain(videoId2);
  });

  it('should remove a video from playlist', async () => {
      const res = await request(app)
        .put(`/api/playlists/${playlistId}`)
        .send({ removeVideoIds: [videoId1] });

      expect(res.status).toBe(200);
      expect(res.body.data.videoIds).not.toContain(videoId1);
      expect(res.body.data.videoIds).toContain(videoId2);
  });

  it('should delete playlist', async () => {
      const res = await request(app).delete(`/api/playlists/${playlistId}`);
      expect(res.status).toBe(200);
  });
});
