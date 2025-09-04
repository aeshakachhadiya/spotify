# Overview

This is a Spotify-like music streaming application built with a full-stack architecture. The application provides music playback functionality, user authentication, playlist management, and social features like liking songs. It features a modern web interface with a dark theme resembling Spotify's design, complete with a music player, sidebar navigation, and responsive layout.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server. The frontend follows a component-based architecture with a clear separation of concerns.

**UI Components**: Built with shadcn/ui components based on Radix UI primitives, providing a consistent and accessible design system. The UI uses Tailwind CSS for styling with a custom dark theme that mimics Spotify's visual design.

**State Management**: Uses TanStack Query (React Query) for server state management, data fetching, and caching. Local component state is managed with React hooks.

**Routing**: Implements client-side routing using Wouter, a lightweight routing library. The app has conditional routing based on authentication status - unauthenticated users see a landing page while authenticated users access the main application.

**Form Handling**: React Hook Form with Zod schema validation for type-safe form handling and validation.

## Backend Architecture

**Server Framework**: Express.js with TypeScript, providing RESTful API endpoints for all application functionality.

**Database Layer**: Uses Drizzle ORM with PostgreSQL (specifically Neon Database) for data persistence. The schema includes tables for users, songs, playlists, playlist songs, liked songs, and session storage.

**API Design**: RESTful endpoints organized by resource type (songs, playlists, users, authentication). All endpoints use consistent error handling and response formats.

**File Structure**: Follows a clean separation with server code in the `server/` directory, client code in `client/`, and shared types/schemas in `shared/`.

## Authentication System

**Provider**: Replit Authentication using OpenID Connect (OIDC) for secure user authentication and authorization.

**Session Management**: Express sessions with PostgreSQL session storage using connect-pg-simple. Sessions are configured with secure cookies and a 7-day TTL.

**Authorization**: Protected routes use middleware to verify authentication status. The system includes both server-side route protection and client-side conditional rendering.

**User Management**: User profiles are automatically created/updated during the authentication flow with support for profile images and user metadata.

## Data Storage

**Primary Database**: PostgreSQL hosted on Neon Database, chosen for its serverless scaling capabilities and PostgreSQL compatibility.

**ORM**: Drizzle ORM provides type-safe database operations with schema-first development. Database migrations are managed through Drizzle Kit.

**Schema Design**: Relational design with proper foreign key relationships between users, songs, playlists, and social features. Includes proper indexing for session management.

## Core Features

**Music Playbook**: Full-featured audio player with play/pause, progress tracking, volume control, shuffle, and repeat modes. Supports song queuing and playback state management.

**Playlist Management**: Users can create, update, and delete playlists. Support for adding/removing songs from playlists with proper relationship management.

**Social Features**: Song liking system that allows users to maintain a personal collection of favorite tracks.

**Search & Discovery**: Basic song browsing with plans for search functionality and artist/album organization.

## External Dependencies

**Database**: Neon Database (PostgreSQL) - Serverless PostgreSQL database with automatic scaling and built-in connection pooling.

**Authentication**: Replit Authentication service using OpenID Connect protocol for secure user authentication.

**UI Framework**: shadcn/ui component library built on top of Radix UI primitives, providing accessible and customizable components.

**Styling**: Tailwind CSS for utility-first styling with custom CSS variables for theming support.

**Build Tools**: Vite for fast development and optimized production builds, with TypeScript support throughout the stack.

**Validation**: Zod for runtime type checking and schema validation across both client and server code.