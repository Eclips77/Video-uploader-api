# Video Management API

A production-grade, RESTful API built with **TypeScript** and **Express.js**, designed for managing videos, genres, and playlists. This application adheres to **SOLID** principles and **Clean Architecture**, ensuring scalability, maintainability, and testability.

## 🚀 Features

-   **Video Management**: Upload, update, and manage videos with metadata.
-   **Smart Encoding**: Efficiently processes videos using FFmpeg. Only re-encodes when source properties (Codec, FPS, Resolution, Bitrate) do not match the target configuration.
-   **Playlist Management**: create and manage playlists with smart updates (atomic add/remove).
-   **Smart Search**: Filter videos by text, genres, language, and target audience.
-   **Robust Validation**: Input validation using **Zod**.
-   **Logging**: Singleton Logger implementation with console and file output.
-   **Persistence**: File-based JSON storage (designed with the Repository pattern for easy swapping to a real DB).
-   **Error Handling**: Centralized error handling with unified response format.

## 🛠️ Technology Stack

-   **Language**: TypeScript (Strict Mode)
-   **Framework**: Express.js
-   **File Upload**: Busboy
-   **Video Processing**: Fluent-FFmpeg
-   **Validation**: Zod
-   **Testing**: Jest + Supertest
-   **Utilities**: UUID, fs-extra, dotenv

## 📋 Prerequisites

-   **Node.js** (v18+ recommended)
-   **FFmpeg** installed on your system.
    -   *Linux (Ubuntu/Debian)*: `sudo apt install ffmpeg`
    -   *macOS*: `brew install ffmpeg`
    -   *Windows*: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH.

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
    Create a `.env` file in the root directory (or modify the existing one) with the following default values:

    ```env
    PORT=3000
    LOG_LEVEL=info

    # Storage Paths
    STORAGE_PATH=./storage
    TEMP_PATH=./temp

    # Smart Encoding Configuration
    VIDEO_TARGET_CODEC=libx264
    VIDEO_TARGET_FORMAT=mp4
    AUDIO_TARGET_CODEC=aac
    TARGET_FPS=30
    TARGET_BITRATE=5000k
    TARGET_RESOLUTION=1920x1080
    ```

## 🚀 Running the Application

### Development Mode
Runs the server with hot-reloading (nodemon).
```bash
npm run dev
```

### Production Build
Compiles TypeScript to JavaScript and runs the optimized build.
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the configured PORT).

## 🧪 Testing

The project includes comprehensive integration tests.

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

## 📖 API Documentation

### 🎥 Videos

-   **GET /api/videos**
    -   Get all videos.
    -   *Query Params*:
        -   `q`: Search text (title, creator, description).
        -   `genres`: Filter by genre ID(s).
        -   `language`: Filter by language.
        -   `targetAudience`: Filter by audience.
        -   `page`, `limit`: Pagination.
        -   `sort`: Sort field (e.g., `uploadTime`).

-   **POST /api/videos**
    -   Create a video.
    -   *Header*: `Content-Type: multipart/form-data`
    -   *Body*: `title`, `creator`, `description`, `targetAudience`, `language`, `genres` (array of IDs), `video` (file).

-   **GET /api/videos/:id** - Get video by ID.
-   **PUT /api/videos/:id** - Update video metadata or file.
-   **DELETE /api/videos/:id** - Delete video.

### 🏷️ Genres

-   **GET /api/genres** - Get all genres.
-   **POST /api/genres** - Create a genre (`{ "name": "Action" }`).
-   **PUT /api/genres/:id** - Update a genre.
-   **DELETE /api/genres/:id** - Delete a genre.

### 📜 Playlists

-   **GET /api/playlists** - Get all playlists.
-   **POST /api/playlists** - Create a playlist.
-   **PUT /api/playlists/:id** - Smart update.
    -   *Body Example*:
        ```json
        {
          "name": "New Name",
          "addVideoIds": ["uuid-1", "uuid-2"],
          "removeVideoIds": ["uuid-3"]
        }
        ```
-   **DELETE /api/playlists/:id** - Delete a playlist.

## 🏗️ Architecture

The codebase follows the **Clean Architecture** principles:

-   **`src/domain`**: Entities and Repository Interfaces. Pure business logic, no dependencies.
-   **`src/application`**: Services and DTOs. Orchestrates business use cases.
-   **`src/infrastructure`**: Implementation details (Persistence, Logger, Encoding).
-   **`src/interfaces`**: Web layer (Controllers, Routes, Middleware).

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---
**Author**: Jules (AI Agent)
