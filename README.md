# Future Forge - Innovation's Launchpad

A cutting-edge procurement management platform that connects inventors with investors, featuring AI-assisted invention development, 3D modeling capabilities, and marketplace functionality.

## 🌟 Features

### Core Platform
- **Dual Role System**: Users can be inventors, investors, or both
- **AI-Powered Assistance**: GPT-4o integration for invention feedback and market analysis
- **3D Modeling Workspace**: Built-in tools for creating and editing 3D models
- **Investment Marketplace**: Connect inventors with potential investors
- **Subscription Model**: 7-day trial for inventors, then paid subscription

### Security & Trust
- **Verified Inventor System**: Manual verification with document review
- **Two-Factor Authentication**: SMS/email verification for enhanced security
- **File Upload Security**: Virus scanning and metadata stripping
- **Privacy Controls**: Granular control over invention and profile visibility

### Growth & Engagement
- **Referral Program**: Shareable links with bonus tier system (+7 to +14 days free)
- **Achievement System**: 8 milestone achievements for inventors and investors
- **Social Integration**: One-click sharing to Twitter and LinkedIn
- **Featured Spotlight**: Weekly highlighted inventions on homepage

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and build
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Node.js** with Express.js
- **TypeScript** with ESNext modules
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon serverless)
- **OpenAI API** for AI features

### Development Tools
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations
- **TypeScript** for type safety

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/future-forge.git
cd future-forge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy and configure your environment variables
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/           # Utilities and configurations
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database interface
│   └── services/          # Business logic
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── README.md
```

## 🗄️ Database Schema

The application uses PostgreSQL with Drizzle ORM. Key entities include:

- **Users**: Inventor and investor profiles
- **Inventions**: Core invention data with categories
- **Investments**: Investment tracking and progress
- **AI Interactions**: Historical AI assistance records
- **Achievements**: Gamification and progress tracking

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema changes

## 🚀 Deployment

The application is optimized for deployment on platforms like:

- **Replit** (recommended)
- **Vercel** 
- **Railway**
- **Heroku**

### Production Build

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

This project includes multiple security measures:
- Regular dependency updates
- File upload sanitization
- Two-factor authentication
- Verified user system

Recently patched CVE-2025-30208 (Vite vulnerability) - upgraded to secure version 5.4.19.

## 📞 Support

For support, email support@futureforge.com or create an issue in this repository.

---

Built with ❤️ for innovators and investors worldwide.