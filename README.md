# Video Management API

A production-grade, RESTful API built with **TypeScript** and **Express.js**, designed for managing videos, genres, and playlists. This application adheres to **SOLID** principles and **Clean Architecture**, ensuring scalability, maintainability, and testability.

## 🚀 Features

-   **Video Management**: Upload, update, and manage videos with metadata.
-   **Smart Encoding**: Efficiently processes videos using FFmpeg. Only re-encodes when source properties (Codec, FPS, Resolution, Bitrate) do not match the target configuration.
-   **Playlist Management**: create and manage playlists with smart updates (atomic add/remove).
-   **Smart Search**: Filter videos by text, genres, language, and target audience.
-   **Robust Validation**: Input validation using **Zod**.
-   **Logging**: Singleton Logger implementation with console and file output.
-   **Persistence**: Supports **JSON/FileSystem** (default) or **MongoDB**.
-   **Storage**: Supports **Local Filesystem** (default) or **AWS S3**.
-   **Frontend**: Stunning React Dashboard included.

## 🛠️ Technology Stack

-   **Language**: TypeScript (Strict Mode)
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose) or JSON (File System)
-   **Storage**: AWS S3 or Local File System
-   **File Upload**: Busboy / Multer
-   **Video Processing**: Fluent-FFmpeg
-   **Validation**: Zod
-   **Testing**: Jest + Supertest

## 📋 Prerequisites

-   **Node.js** (v18+ recommended)
-   **FFmpeg** installed on your system.
-   **MongoDB** (optional, if using Mongo persistence).

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
    Create a `.env` file in the root directory.

    **Default (JSON + Local Storage):**
    ```env
    PORT=3000
    LOG_LEVEL=info
    STORAGE_PATH=./storage
    TEMP_PATH=./temp
    DB_TYPE=json
    STORAGE_TYPE=fs
    ```

    **MongoDB + S3:**
    ```env
    PORT=3000
    LOG_LEVEL=info
    DB_TYPE=mongo
    MONGO_URI=mongodb://localhost:27017/video-api
    STORAGE_TYPE=s3
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=your_key
    AWS_SECRET_ACCESS_KEY=your_secret
    AWS_S3_BUCKET=your_bucket
    ```

## 🚀 Running the Application

### Development Mode
Runs the server with hot-reloading.
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
npm test
```

## 🏗️ Architecture

The codebase follows **Clean Architecture**:
-   **Domain**: Interfaces (`IRepository`, `IStorageService`) and Entities.
-   **Application**: Services (`VideoService`) containing business logic.
-   **Infrastructure**: Implementations for Mongo, S3, FS, Logger, FFmpeg.
-   **Interfaces**: Controllers and Routes.
-   **Container**: Dependency Injection setup based on config.

---
**Author**: Eclips
