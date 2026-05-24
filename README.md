# Video Compressor

A small web app and API to compress videos and upload the result to Cloudinary.

## Features

- Upload a video file and compress it server-side using FFmpeg.
- Upload compressed output to Cloudinary and return a public URL.
- Simple React frontend to select and upload videos.

## Repository structure

- backend/ — Express API that performs compression and Cloudinary upload
- frontend/ — Vite + React UI for uploading videos

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

Note: The backend uses an FFmpeg package installer (`@ffmpeg-installer/ffmpeg`), so you do not need a system-level FFmpeg binary in most cases.

## Environment variables (backend)

Create a `.env` file inside `backend/` with the following variables:

- `PORT` — port the backend will listen on (e.g. `8000`)
- `CORS_ORIGIN` — origin allowed by CORS (e.g. `http://localhost:5173`)
- `CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
- `CLOUDINARY_API_KEY` — your Cloudinary API key
- `CLOUDINARY_API_SECRET` — your Cloudinary API secret

Do NOT commit secrets to source control.

## Setup

Backend

```bash
cd backend
npm install
# start in development (uses nodemon)
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

By default this repository uses `backend` and `frontend` running concurrently: the frontend Vite dev server typically runs on `http://localhost:5173` and the backend on the port set in `backend/.env` (commonly `8000`).

## API

Endpoint

- POST `/api/v1/video/compress-video`

Details

- Content type: `multipart/form-data`
- File field name: `video`
- Response: JSON `ApiResponse` object: `{ statusCode, data, message, success }` where `data` is the uploaded video's URL on Cloudinary when successful.

Example (curl)

```bash
curl -X POST http://localhost:8000/api/v1/video/compress-video \
  -F "video=@/path/to/your/video.mp4"
```

Successful response example

```json
{
  "statusCode": 200,
  "data": "https://res.cloudinary.com/.../compressed-...mp4",
  "message": "Video compressed successfully",
  "success": true
}
```

Temporary files

Uploaded and compressed files are stored under `backend/public/temp/` during processing and are removed after a successful upload.

## Development notes

- The backend's dev script uses nodemon and runs `src/index.js` with `dotenv` loaded.
- The compressor uses `fluent-ffmpeg` with the ffmpeg path provided by `@ffmpeg-installer/ffmpeg`.
- Multer is used for temporary disk storage of the incoming file (`public/temp/`).
