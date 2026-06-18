# AI Short Video Generator

Create vertical short-form videos from a text prompt using AI-generated script scenes, narration, captions, images, and a Remotion render pipeline.

This project is built with Next.js, Clerk, Neon Postgres, Drizzle ORM, and Remotion. A user can sign in, generate a story-driven short video, preview it in the dashboard, and export an `.mp4`.

## What It Does

- Generates a scene-by-scene video script with Gemini
- Converts the combined narration into speech with AIGuru Lab TTS
- Transcribes the audio into word-level captions with AssemblyAI
- Creates scene images with Clipdrop
- Supports uploaded reference images to steer image generation
- Stores video metadata in Postgres via Drizzle
- Renders the final vertical video with Remotion

## Tech Stack

- `Next.js 16`
- `React 19`
- `Tailwind CSS 4`
- `Clerk` for authentication
- `Neon Postgres` for persistence
- `Drizzle ORM` for database access
- `Gemini` for script generation and reference-image prompt analysis
- `Clipdrop` for text-to-image generation
- `AIGuru Lab` for text-to-speech
- `AssemblyAI` for caption generation
- `Remotion` for final video composition and rendering

## How The App Works

1. A signed-in user opens `/dashboard/create-new`.
2. The app collects a topic, visual style, voice style, duration, and optional reference images.
3. `/api/get-video-script` asks Gemini for a JSON array of scenes.
4. `/api/generate-audio` turns the combined scene narration into an audio URL.
5. `/api/generate-caption` transcribes that audio into word-level caption timing.
6. `/api/generate-image` creates one image per scene, optionally guided by uploaded references.
7. `/api/videos` stores the generated script, audio URL, captions, and image list.
8. The dashboard previews the result with the Remotion player.
9. `/api/render` calls the Remotion CLI and writes the final `.mp4` to `public/renders/`.

## Project Structure

```text
app/
  api/
    generate-audio/      Text-to-speech API route
    generate-caption/    Caption/transcription API route
    generate-image/      Image generation API route
    get-video-script/    Script generation API route
    render/              Final Remotion render API route
    users/               User sync route
    videos/              Video create/list routes
  dashboard/
    _components/         Dashboard player, cards, Remotion video component
    create-new/          Video creation flow
configs/
  db.js                  Drizzle + Neon database connection
  schema.js              Drizzle schema
  FirebaseConfig.js      Firebase client storage config
remotion-composition/
  root.jsx               Remotion composition registration
public/
  renders/               Generated mp4 files and temporary render props
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Push the database schema

```bash
npm run db:push
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` starts the Next.js dev server
- `npm run build` builds the production app
- `npm run start` starts the production server
- `npm run lint` runs ESLint
- `npm run db:push` pushes the Drizzle schema to the database
- `npm run db:studio` opens Drizzle Studio

## Database Schema

The main `videoData` table stores:

- `script`: JSON scene array
- `audioFileUrl`: narration audio URL
- `captions`: JSON array of word timings
- `imageList`: array of generated image sources
- `createdBy`: normalized user email
- `createdAt`: timestamp

There is also a `users` table for basic Clerk user sync.

## API Summary

- `POST /api/get-video-script`: generate structured scene script
- `POST /api/generate-audio`: generate narration audio
- `POST /api/generate-caption`: generate timed captions from audio
- `POST /api/generate-image`: generate scene image
- `GET /api/videos?email=...`: fetch a user's videos
- `POST /api/videos`: save generated video metadata
- `POST /api/render`: render final mp4 for a saved video


