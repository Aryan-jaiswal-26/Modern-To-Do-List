# Streakify

A modern habit tracking and productivity app built with Next.js, featuring goal management, task tracking, and team collaboration.

## Features

- 🎯 **Goal Tracking** - Create and track daily/weekly habits
- ✅ **Task Management** - Organize your to-dos with due dates
- 👥 **Team Workspaces** - Collaborate with others on shared goals
- 🌙 **Dark/Light Theme** - Beautiful UI that adapts to your preference
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Secure Authentication** - NextAuth.js with email/password

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: SWR
- **UI Components**: Custom components with Radix UI

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd streakify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase and email credentials:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```

4. **Set up the database**
   - Run the SQL schema in your Supabase dashboard
   - Tables: users, goals, tasks, workspaces, workspace_members

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── goals/            # Goals management
│   ├── tasks/            # Task management
│   └── workspaces/       # Team collaboration
├── components/           # Reusable UI components
├── lib/                 # Utilities and configurations
└── public/              # Static assets
```

## API Endpoints

- `GET /api/goals` - Fetch user goals
- `POST /api/goals` - Create new goal
- `GET /api/tasks` - Fetch user tasks
- `POST /api/tasks` - Create new task
- `GET /api/workspaces` - Fetch user workspaces
- `POST /api/workspaces` - Create new workspace

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details