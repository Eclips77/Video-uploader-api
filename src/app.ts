import express from 'express';
import cors from 'cors';
import { genreRouter } from './interfaces/http/routes/genre.routes';
import { videoRouter } from './interfaces/http/routes/video.routes';
import { playlistRouter } from './interfaces/http/routes/playlist.routes';
import { errorHandler } from './interfaces/http/middleware/errorHandler';
import { Logger } from './infrastructure/logger/Logger';

const logger = Logger.getInstance();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  logger.info('Incoming request', { method: req.method, path: req.path, ip: req.ip });
  next();
});

// Routes
app.use('/api/genres', genreRouter);
app.use('/api/videos', videoRouter);
app.use('/api/playlists', playlistRouter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error Handling
app.use(errorHandler);

export { app };
