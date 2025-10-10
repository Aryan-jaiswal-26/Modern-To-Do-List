# Streakify 🎯

> A modern collaborative productivity platform that transforms habit tracking and goal achievement through gamification and team collaboration.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

## 🚀 What is Streakify?

Streakify is a comprehensive productivity application that combines personal task management with collaborative goal tracking. It empowers individuals and teams to build consistent habits, track progress through visual streaks, and achieve objectives together in shared workspaces.

### Key Concepts
- **Personal Tasks**: Traditional to-do list management with due dates and notes
- **Goals & Streaks**: Habit tracking with visual streak counters and completion history
- **Collaborative Workspaces**: Team environments for shared goal achievement
- **Gamification**: Progress visualization and celebration animations

## ✨ Features

### 🎯 **Smart Goal Tracking**
- Create daily, weekly, or custom schedule goals
- Visual streak counters with completion history
- Progress analytics and achievement celebrations
- Flexible scheduling (specific days, intervals)

### ✅ **Advanced Task Management**
- Rich task creation with notes and due dates
- Priority levels and completion tracking
- Personal task organization
- Quick task actions and bulk operations

### 👥 **Team Collaboration**
- Shared workspaces for team goal alignment
- Role-based permissions (owner, member)
- Invite system with secure codes
- Collaborative goal setting and tracking

### 🎨 **Modern User Experience**
- Responsive design for all devices
- Dark/light theme with system preference detection
- Smooth animations and micro-interactions
- Confetti celebrations for achievements
- Clean, intuitive interface

### 🔐 **Security & Authentication**
- Secure email/password authentication
- JWT session management
- Protected API routes
- Data validation and sanitization

## 🏗️ Architecture

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|----------|
| **Frontend** | Next.js 14 + React 18 | Server-side rendering, App Router |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Database** | Supabase (PostgreSQL) | Managed database with real-time features |
| **Authentication** | NextAuth.js | Secure session management |
| **State Management** | Zustand + SWR | Global state + server state caching |
| **Animations** | Framer Motion | Smooth UI transitions |
| **UI Components** | Custom + Radix UI | Accessible component primitives |
| **Validation** | Zod | Type-safe schema validation |

### **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   Next.js API   │───▶│   Supabase DB   │
│  (React/TS)     │    │   Routes        │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Zustand Store  │    │  NextAuth.js    │    │  Row Level      │
│  (Client State) │    │ (Authentication)│    │   Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Database Schema**

```sql
-- Core entities and relationships
users (id, email, password, name)
tasks (id, user_id, title, notes, completed, due_date)
goals (id, title, description, schedule_type, schedule_days, user_id, workspace_id, owner_id)
workspaces (id, name, owner_id)
workspace_members (id, workspace_id, user_id, role)
goal_completions (id, goal_id, user_id, date, notes)
invite_codes (id, workspace_id, code, expires_at)
```

## 🔄 User Flow

### **New User Journey**
1. **Registration** → Create account with email/password
2. **Onboarding** → Dashboard tour and first task/goal creation
3. **Personal Productivity** → Add tasks and set up daily habits
4. **Team Collaboration** → Create or join workspaces
5. **Goal Achievement** → Track progress and celebrate streaks

### **Daily Usage Flow**
1. **Check Dashboard** → View today's tasks and goal status
2. **Complete Tasks** → Mark items as done, add new ones
3. **Update Goals** → Log daily habit completions
4. **Team Check-in** → Review workspace progress
5. **Celebrate Wins** → Enjoy streak milestones and achievements

### **Workspace Collaboration Flow**
1. **Create Workspace** → Set up team environment
2. **Invite Members** → Share invite codes with team
3. **Set Team Goals** → Define shared objectives
4. **Track Progress** → Monitor individual and team completion
5. **Achieve Together** → Celebrate collective success

## 🚀 Future Enhancements

### **Phase 1: Enhanced Analytics**
- [ ] Detailed progress charts and statistics
- [ ] Goal completion trends and insights
- [ ] Personal productivity metrics
- [ ] Team performance dashboards

### **Phase 2: Advanced Features**
- [ ] Goal templates and categories
- [ ] Habit stacking and goal dependencies
- [ ] Reminder notifications and scheduling
- [ ] Mobile app (React Native)

### **Phase 3: Social & Gamification**
- [ ] Public goal sharing and social feeds
- [ ] Achievement badges and rewards system
- [ ] Leaderboards and friendly competition
- [ ] Goal marketplace and community templates

### **Phase 4: Integration & AI**
- [ ] Calendar integration (Google, Outlook)
- [ ] Third-party app connections (Todoist, Notion)
- [ ] AI-powered goal suggestions
- [ ] Smart habit recommendations

### **Phase 5: Enterprise Features**
- [ ] Organization-level workspaces
- [ ] Advanced role management
- [ ] Custom branding and themes
- [ ] API for third-party integrations

## 📁 Project Structure

```
Streakify/
├── streakify/                   # Main application
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   ├── api/                # API endpoints
│   │   │   ├── auth/           # Authentication routes
│   │   │   ├── goals/          # Goal management
│   │   │   ├── tasks/          # Task operations
│   │   │   └── workspaces/     # Workspace management
│   │   ├── dashboard/          # Main dashboard
│   │   ├── goals/              # Goal pages
│   │   ├── tasks/              # Task pages
│   │   └── workspaces/         # Workspace pages
│   ├── components/             # React components
│   │   ├── providers/          # Context providers
│   │   ├── ui/                 # Reusable UI components
│   │   ├── goals/              # Goal-specific components
│   │   ├── tasks/              # Task components
│   │   └── workspaces/         # Workspace components
│   ├── lib/                    # Utilities & configuration
│   │   ├── auth.ts             # Authentication config
│   │   ├── supabase.ts         # Database client
│   │   ├── store.ts            # State management
│   │   ├── validators.ts       # Schema validation
│   │   └── utils.ts            # Helper functions
│   └── public/                 # Static assets
├── database/
│   └── schema.sql              # Database setup
├── docs/
│   ├── SETUP.md               # Installation guide
│   └── API.md                 # API documentation
├── requirements.txt           # Dependencies list
└── README.md                  # This file
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/)
- UI components inspired by [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide React](https://lucide.dev/)

---

**Ready to streakify your goals?** 🔥 [Get started with the setup guide](docs/SETUP.md)