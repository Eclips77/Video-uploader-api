import request from 'supertest';
import { app } from '../src/app';
import fs from 'fs-extra';
import path from 'path';

const TEST_STORAGE = './test_storage';

beforeAll(async () => {
    // Override storage path for tests by mocking config or just ensure we use a separate path if possible.
    // Since config is imported singleton, mocking is harder without DI or jest.mock.
    // For simplicity, I'll rely on the fact that I can clean up 'storage' or use .env.test if I had set it up.
    // But since I didn't set up .env.test loading logic deeply, I will just clean up the default storage.
    // WAIT, better: I'll clean up the json files in the default storage location.
});

afterAll(async () => {
    // Cleanup
});

describe('Genre API', () => {
  let genreId: string;

  it('should create a new genre', async () => {
    const res = await request(app)
      .post('/api/genres')
      .send({ name: 'Action' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe('Action');
    genreId = res.body.data.id;
  });

  it('should get all genres', async () => {
    const res = await request(app).get('/api/genres');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((g: any) => g.id === genreId)).toBe(true);
  });

  it('should update a genre', async () => {
    const res = await request(app)
        .put(`/api/genres/${genreId}`)
        .send({ name: 'Action Updated' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Action Updated');
  });

  it('should delete a genre', async () => {
    const res = await request(app).delete(`/api/genres/${genreId}`);
    expect(res.status).toBe(200);
  });

  it('should return 404 for deleted genre', async () => {
    const res = await request(app).get(`/api/genres/${genreId}`);
    expect(res.status).toBe(404); // Or 500 if implementation throws generic error, but handled by middleware should be 404
    // Wait, getById throws NotFoundError which maps to 404.
  });
});
