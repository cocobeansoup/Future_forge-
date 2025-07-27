# Future Forge - Innovation's Launchpad

## Overview

Future Forge is a comprehensive platform that connects inventors with investors, featuring AI-assisted invention development, 3D modeling capabilities, and marketplace functionality. The application is built as a full-stack TypeScript application with a React frontend and Express backend, utilizing PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESNext modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with Express routes
- **Authentication**: Custom authentication with bcrypt password hashing

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations in `./migrations` directory
- **Connection**: Neon serverless driver with WebSocket support

## Key Components

### User Management
- **Dual Role System**: Users can be inventors, investors, or both
- **Subscription Model**: 7-day trial for inventors, then paid subscription
- **Profile Management**: Avatar uploads, bio, and portfolio management

### Invention Platform
- **Invention Lifecycle**: Track inventions from concept to completion
- **AI Integration**: OpenAI GPT-4o for invention feedback and suggestions
- **3D Modeling**: Built-in workspace for creating and editing 3D models
- **Categories & Tags**: Organized classification system for discoverability

### Investment System
- **Funding Goals**: Set and track funding targets for inventions
- **Investment Tracking**: Monitor investor contributions and progress
- **Auction System**: Support for timed auctions with bidding functionality

### AI-Powered Features
- **Invention Feedback**: Comprehensive analysis of invention concepts
- **Market Analysis**: Target market and competitive landscape insights
- **3D Model Suggestions**: AI-generated recommendations for 3D modeling
- **Technical Improvements**: Suggestions for design and manufacturing

## Data Flow

### Authentication Flow
1. User registration with role selection (inventor/investor)
2. Password hashing with bcrypt before storage
3. Session management through HTTP-only cookies
4. Role-based access control for features

### Invention Creation Flow
1. Inventor creates invention with basic details
2. Optional AI assistance for concept refinement
3. 3D modeling workspace for visual representation
4. Publication to marketplace for investor discovery

### Investment Flow
1. Investors browse published inventions
2. Investment commitment with amount specification
3. Progress tracking and updates from inventors
4. Platform fee calculation (5% default) on transactions

### AI Integration Flow
1. User submits invention details or modeling requests
2. OpenAI API processes requests with specialized prompts
3. Structured responses formatted for user consumption
4. Historical tracking of AI interactions

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT-4o for AI-powered features
- **Stripe**: Payment processing for subscriptions and transactions

### Development Tools
- **Replit Integration**: Development environment optimization
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast backend bundling for production

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Database**: Drizzle push for schema synchronization
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database Migrations**: Automated schema deployment via Drizzle

### Architecture Decisions

#### Database Choice: PostgreSQL with Drizzle
- **Problem**: Need for type-safe database operations with complex relationships
- **Solution**: Drizzle ORM with PostgreSQL for robust data modeling
- **Benefits**: Type safety, migration management, and serverless compatibility
- **Trade-offs**: Learning curve for Drizzle syntax vs. traditional ORMs

#### AI Integration: OpenAI GPT-4o
- **Problem**: Providing intelligent feedback and assistance to inventors
- **Solution**: Direct OpenAI API integration with structured prompts
- **Benefits**: Latest model capabilities, JSON response formatting
- **Trade-offs**: External dependency and API costs vs. offline solutions

#### Frontend State: TanStack Query
- **Problem**: Complex server state management with caching needs
- **Solution**: React Query for declarative data fetching and caching
- **Benefits**: Automatic background updates, optimistic updates, error handling
- **Trade-offs**: Additional complexity vs. simple fetch calls

#### Component Library: shadcn/ui + Radix
- **Problem**: Need for accessible, customizable UI components
- **Solution**: shadcn/ui built on Radix primitives with Tailwind styling
- **Benefits**: Accessibility compliance, customization flexibility, copy-paste components
- **Trade-offs**: Larger bundle size vs. building from scratch