# Vihaara - Mindful Digital Sanctuary

## Overview

Vihaara is a privacy-focused mental wellness application that serves as a personal sanctuary for mental clarity and emotional well-being. The application provides AI-powered journaling insights, mood tracking, chat companion, and wellness resources while keeping all user data locally stored on the device.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: TailwindCSS with custom design tokens for theming
- **State Management**: React Context for settings and local storage for data persistence
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Framework**: Express.js server with TypeScript
- **Database**: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- **AI Integration**: OpenAI GPT-3.5-turbo for intelligent insights and responses
- **Fallback System**: Local content generation when AI services are unavailable

### Development Environment
- **Build Tool**: Vite with React plugin and TypeScript support
- **Package Manager**: npm with lockfile for dependency management
- **TypeScript**: Full TypeScript support across client, server, and shared code

## Key Components

### Core Features
1. **Journaling System**: Rich text journaling with AI-powered analysis and insights
2. **Mood Tracking**: Daily mood logging with pattern analysis and visualizations
3. **AI Chat Companion**: Conversational interface with configurable tone and response length
4. **Health Advice**: Category-based wellness tips and guidance
5. **Mental Peace Techniques**: Guided practices for mindfulness and stress relief
6. **Daily Wellness Tips**: Personalized daily insights based on user preferences

### Privacy and Data Management
- **Local Storage**: All user data persists in browser localStorage
- **No Cloud Storage**: Zero server-side data persistence for user content
- **Export Functionality**: Users can export their data locally
- **Data Control**: Complete user control over data deletion and management

### UI/UX Design
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Themes**: Complete theming system with user preference persistence
- **Accessibility**: Built on Radix UI primitives ensuring accessibility compliance
- **Custom Typography**: Multiple font families for different content types (heading, body, journal)

## Data Flow

### Data Persistence Pattern
1. User interactions generate data (journal entries, mood logs, chat messages)
2. Data is immediately stored in browser localStorage with structured keys
3. Components read from localStorage on mount and update state
4. No network requests for user data storage/retrieval

### AI Integration Flow
1. User triggers AI feature (journal analysis, chat, wellness tips)
2. Frontend makes API call to Express backend with user content
3. Backend processes request through OpenAI API with configured prompts
4. Fallback content system activates if AI service unavailable
5. Response returned to frontend and optionally cached locally

### Settings Management
1. User preferences stored in localStorage and React Context
2. Theme changes immediately apply via CSS class manipulation
3. AI tone and response length settings affect API calls to backend
4. Settings persist across browser sessions

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form for forms
- **UI Framework**: Radix UI primitives, Lucide React icons, class-variance-authority
- **Styling**: TailwindCSS, clsx for conditional classes
- **Backend**: Express, Drizzle ORM, Neon Database connector
- **AI Services**: OpenAI SDK for GPT integration
- **Development**: TypeScript, Vite, ESBuild for production builds

### Runtime Services
- **OpenAI API**: Required for AI features (journaling analysis, chat, wellness tips)
- **Environment Variables**: OPENAI_API_KEY for AI functionality, DATABASE_URL for future database integration

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend with hot reload
- **Port Configuration**: Frontend on port 5000, configurable via environment
- **Database**: Currently using in-memory storage, configured for PostgreSQL migration

### Production Build
- **Build Process**: Vite builds frontend static assets, ESBuild bundles backend
- **Asset Serving**: Express serves static files in production mode
- **Environment**: NODE_ENV=production for optimized builds

### Replit Configuration
- **Autoscale Deployment**: Configured for Replit's autoscale deployment target
- **Build Commands**: npm run build for production assets
- **Runtime**: Node.js 20 with web module support

## Changelog

```
Changelog:
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```