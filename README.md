# Portfolio Website

A modern, interactive portfolio website built with Next.js featuring a neon slime glass aesthetic, animated background effects, and an AI voice assistant powered by OpenAI's Realtime API.

## Overview

This portfolio showcases professional work, skills, experience, and education through an immersive user experience. The site includes scroll triggered animations, a dynamic background that reacts to AI speech, and a fully functional admin panel for content management.

## Technologies

- Next.js 15 (Pages Router)
- React 18
- TypeScript
- HeroUI v2 (UI Component Library)
- Tailwind CSS 4
- Framer Motion (Motion animations)
- Supabase (PostgreSQL database and authentication)
- OpenAI Agents SDK (Realtime voice assistant)
- OpenAI TTS API (High quality text to speech)
- next themes (Dark mode support)

## Features

### Portfolio Sections

- Hero Section: Introduction with scroll triggered image reveal effect
- Featured Projects: Showcase of work with glass morphism cards
- Skills: Categorized technical skills display
- Experience: Timeline of professional experience
- Education: Academic background and credentials
- Contact: Contact form and information

### AI Voice Assistant

The portfolio includes an interactive voice assistant called "Ask Alex" that:

- Answers questions about the portfolio owner using data from Supabase
- Provides conversational responses with natural speech patterns
- Supports both text and voice input
- Features animated background dots that react to AI speech
- Displays conversation history in real time
- Supports multiple voice options including high quality TTS voices
- Configurable through admin panel

### Visual Effects

- Neon slime glass morphism design theme
- Animated background dots that respond to AI speech
- Scroll triggered animations that reset when scrolled back into view
- Smooth transitions and hover effects throughout
- Dark mode support

### Admin Panel

A secure admin dashboard for managing portfolio content:

- Personal information management
- Projects CRUD operations
- Skills categorization and management
- Experience entries
- Education records
- Voice assistant settings configuration

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun package manager
- Supabase account and project
- OpenAI API key

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd PROJECT_PORTFOLIO
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the database

Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor to create the necessary tables.

5. Run database migrations

If needed, run any migration scripts from the `supabase/` directory in your Supabase SQL editor.

6. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
PROJECT_PORTFOLIO/
├── components/
│   ├── admin/          # Admin panel components
│   ├── sections/       # Portfolio section components
│   ├── ui/             # Reusable UI components
│   └── voice/          # Voice assistant components
├── config/             # Configuration files
├── lib/
│   ├── openai/         # OpenAI integration
│   └── supabase/       # Supabase client setup
├── pages/
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   └── index.tsx       # Main portfolio page
├── public/             # Static assets
├── scripts/            # Utility scripts
├── styles/             # Global styles
├── supabase/           # Database schema and migrations
└── types/              # TypeScript type definitions
```

## Database Schema

The project uses Supabase PostgreSQL with the following main tables:

- personal_info: Personal information and contact details
- projects: Featured projects with descriptions and links
- skills: Technical skills organized by category
- experience: Professional work experience
- education: Academic credentials
- voice_settings: AI voice assistant configuration

See `supabase/schema.sql` for the complete schema definition.

## API Routes

- `/api/admin/*`: Admin panel API endpoints for CRUD operations
- `/api/voice/token`: Generates ephemeral tokens for OpenAI Realtime API
- `/api/voice/tts`: Generates high quality speech audio using OpenAI TTS API

## Voice Assistant Configuration

The voice assistant can be configured through the admin panel:

- Voice selection: Choose from multiple OpenAI voices
- TTS mode: Toggle between Realtime audio and high quality TTS
- Voice options include standard TTS voices and Realtime only voices (Marin, Cedar)

## Development

### Available Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run migrate`: Run database migration script

### Code Style

The project uses ESLint and Prettier for code formatting. Run `npm run lint` to check and fix code style issues.

## Deployment

1. Build the project

```bash
npm run build
```

2. Start the production server

```bash
npm run start
```

For deployment platforms like Vercel, Netlify, or similar, follow their Next.js deployment guides. Ensure all environment variables are configured in your deployment platform's settings.

## License

Licensed under the MIT license.
