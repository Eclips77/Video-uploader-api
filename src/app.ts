import express from 'express';
import cors from 'cors';
import { genreRouter } from './interfaces/http/routes/genre.routes';
import { videoRouter } from './interfaces/http/routes/video.routes';
import { playlistRouter } from './interfaces/http/routes/playlist.routes';
import { dashboardRouter } from './interfaces/http/routes/dashboard.routes';
import { errorHandler } from './interfaces/http/middleware/errorHandler';
import { Logger } from './infrastructure/logger/Logger';
import { config } from './config/config';
import path from 'path';

const logger = Logger.getInstance();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for videos
app.use('/storage', express.static(config.storagePath));

// Serve React Frontend (in production)
// In dev, we use Vite server. In prod, we assume client is built to client/dist
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Request Logger
app.use((req, res, next) => {
  logger.info('Incoming request', { method: req.method, path: req.path, ip: req.ip });
  next();
});

// Routes
app.use('/api/genres', genreRouter);
app.use('/api/videos', videoRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/dashboard', dashboardRouter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Fallback for React Router (only in production)
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/storage')) {
             return res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        }
        next();
    });
}

// Error Handling
app.use(errorHandler);

export { app };
