# Streakify Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Git

## Installation Steps

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd streakify
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and API keys

#### Run Database Schema
Execute the SQL from `../database/schema.sql` in your Supabase SQL editor:
- Creates tables: users, tasks, goals, workspaces, workspace_members, goal_completions, invite_codes
- Sets up indexes and relationships

### 4. Environment Configuration

Copy environment template:
```bash
cp .env.example .env.local
```

Fill in your `.env.local`:
```env
# NextAuth
NEXTAUTH_SECRET=generate-random-32-char-string
NEXTAUTH_URL=http://localhost:3000

# Supabase (from your project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (optional - for future features)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# App Secret
SECRET_KEY=another-random-string
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Quick Test

1. **Sign Up**: Create account at `/sign-up`
2. **Create Task**: Add a personal task
3. **Create Goal**: Set up a daily habit
4. **Create Workspace**: Start team collaboration
5. **Invite Members**: Use generated invite codes

## Production Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
- Set all `.env.local` variables in your hosting platform
- Update `NEXTAUTH_URL` to your production domain
- Ensure Supabase project is in production mode

## Troubleshooting

**Database Connection Issues**:
- Verify Supabase URL and keys
- Check if SQL schema was executed correctly

**Authentication Problems**:
- Ensure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain

**Build Errors**:
- Run `npm run lint` to check for issues
- Ensure all environment variables are set

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
streakify/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Authentication pages
│   ├── api/            # API endpoints
│   ├── dashboard/      # Main dashboard
│   ├── goals/          # Goal management
│   ├── tasks/          # Task management
│   └── workspaces/     # Team collaboration
├── components/         # React components
├── lib/               # Utilities & config
└── public/            # Static assets
```

## Key Features

- **Personal Tasks**: Create, edit, complete tasks
- **Goal Tracking**: Daily/weekly habits with streaks
- **Team Workspaces**: Collaborative goal setting
- **Invite System**: Share workspace access codes
- **Theme Support**: Light/dark mode toggle
- **Responsive Design**: Mobile-friendly interface

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review this setup guide
3. Create new issue with error details