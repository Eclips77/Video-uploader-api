# Video Management API (NestJS Edition)

A production-grade, RESTful API rewritten in **NestJS** and **TypeScript**, designed for managing videos, genres, and playlists. This application adheres to **Domain-Driven Design (DDD)**, **Solid Principles**, and **Event-Driven Architecture**, ensuring scalability, maintainability, and type safety.

## 🚀 Features

-   **Modular Architecture**: Built with NestJS modules (Videos, Genres, Playlists, Storage, Ffmpeg).
-   **Video Management**: Upload, update, and manage videos with metadata.
-   **Event-Driven Encoding**: Asynchronous video processing using `EventEmitter2`. The API responds immediately after upload, while FFmpeg encodes in the background.
-   **Smart Encoding**: Efficiently processes videos using `fluent-ffmpeg`.
-   **Playlist & Genre Management**: Standard CRUD operations with MongoDB persistence.
-   **Robust Validation**: Strict input validation using **Zod** and Global Pipes.
-   **Global Error Handling**: Centralized exception filtering for consistent API responses.
-   **Persistence**: **MongoDB** (Mongoose).
-   **Storage**: Abstracted storage service supporting **Local Filesystem** (default).
-   **Security**: Secured with **Helmet** and **CORS**.
-   **Frontend**: Modern React Dashboard included (Vite + Tailwind).

## 🛠️ Technology Stack

-   **Framework**: NestJS (Node.js)
-   **Language**: TypeScript (Strict Mode)
-   **Database**: MongoDB (Mongoose)
-   **Storage**: Local File System (Abstracted)
-   **File Upload**: Multer (via NestJS `FileInterceptor`)
-   **Video Processing**: Fluent-FFmpeg
-   **Validation**: Zod
-   **Events**: @nestjs/event-emitter

## 📋 Prerequisites

-   **Node.js** (v18+ recommended)
-   **FFmpeg** installed on your system.
-   **MongoDB** running locally or accessible via URI.

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Eclips77/Video-uploader-api.git
    cd Video-uploader-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    The application validates environment variables on startup. Create a `.env` file in the root directory:

    ```env
    PORT=3000
    LOG_LEVEL=info
    MONGO_URI=mongodb://localhost:27017/video-api
    STORAGE_PATH=./storage
    TEMP_PATH=./temp

    # Encoding Configuration
    VIDEO_TARGET_CODEC=libx264
    VIDEO_TARGET_FORMAT=mp4
    AUDIO_TARGET_CODEC=aac
    TARGET_FPS=30
    TARGET_BITRATE=5000k
    TARGET_RESOLUTION=1920x1080
    ```

## 🚀 Running the Application

### Development Mode
Runs the server with hot-reloading (using Nodemon).
```bash
npm run dev
```

### Production Build
Compiles the NestJS backend and React frontend.
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
npm test
```

## 🏗️ Architecture

The codebase is organized into modular NestJS components:

-   **`src/app.module.ts`**: Root module configuring generic imports (Config, Mongoose, EventEmitter).
-   **`src/common/`**: Shared utilities (Zod Validation Pipe, Global Exception Filter, Config Validation).
-   **`src/modules/`**:
    -   **`videos/`**: Handles video uploads and metadata. Emits `video.uploaded` events.
    -   **`genres/`**: CRUD for video genres.
    -   **`playlists/`**: CRUD for playlists.
    -   **`storage/`**: Abstracted file storage (Local implementation provided).
    -   **`ffmpeg/`**: Service for video encoding logic.

### Video Upload Flow
1.  **Controller**: Receives file -> Validates -> Calls Service.
2.  **Service**: Saves file to storage -> Saves `PENDING` record to DB -> Emits `VideoUploadedEvent`.
3.  **Listener**: Listens for event -> Triggers FFmpeg encoding -> Updates DB to `ACTIVE` or `FAILED`.

---
**Legacy Code**: The original Express.js implementation is preserved in `src_legacy/` for reference.
