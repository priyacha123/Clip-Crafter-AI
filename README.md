# AI Short Video Generator

### AI Tools and Tech Stack
- Next.js
- Tailwindcss and SaaS
- Authentication: clerk
- Database: Neon based Postgres database
- Drizzle and ORM
- Generate text-based script: Gemini API
- Generate audio from text : Google Cloud text-to-speech API
- Generate caption from audio file: Assembly AI
- Generate AI images from text prompt: Replicate API's and Radid API (text-to image API)
- Generate video and extract video file: Remotion AI

### Generate AI Video Script
- Collect info from user (in 'create-new' page) and async these info with **Gemini API** to generate a video script
- For each sync, provide an image prompt to generate AI images too
- Pass this script to **'Google Cloud Text to Speech'** to convert script to Audio MP3
- Save this Audio MP3 File to **Fibrebase Storage** 
- Generate Caption File **(.SRT format)** and store in Firebase Storage
- Generate AI Images from Image Prompt and save in Firebase Storage

- Now, store all this data to **Database**
- Then convert it into **Video** using **Remotion AI**