# 🔥 Streakify - Advanced Goal & Task Tracker

A comprehensive web application for managing tasks, building streaks, and collaborating with others on goals. Built with Flask, SQLite, and modern web technologies.

## ✨ Features

### 🎯 Core Functionality
- **Tasks (One-time)**: Create, manage, and complete individual tasks with priorities and due dates
- **Goals (Repeatable)**: Set target days for habits and track daily streaks
- **Workbench (Collaborative)**: Create shared spaces where teams can work on goals together
- **Analytics**: Comprehensive dashboard with streak tracking and progress visualization

### 🔥 Streak System
- Daily streak tracking for goals
- Best streak records
- Email notifications for missed streaks
- Visual streak indicators with fire animations

### 👥 Collaboration Features
- Create workbenches with invite codes
- Real-time collaboration using WebSockets
- Share goals with team members
- Live activity updates

### 📧 Smart Notifications
- Daily email reminders for missed streaks
- Customizable notification times
- Beautiful HTML email templates
- Automatic streak monitoring

### 🎨 Modern UI/UX
- Glassmorphism design with beautiful gradients
- Responsive design for all devices
- Dark/Light theme support
- Smooth animations and transitions
- Intuitive navigation

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd streakify/Modern-To-Do-List
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup Supabase Database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the queries from `supabase_setup.sql`
   - **IMPORTANT**: Run this additional SQL to fix RLS policies:
   ```sql
   -- Disable RLS for users table to allow registration
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
   ALTER TABLE goals DISABLE ROW LEVEL SECURITY;
   ALTER TABLE workbenches DISABLE ROW LEVEL SECURITY;
   ALTER TABLE workbench_members DISABLE ROW LEVEL SECURITY;
   ALTER TABLE workbench_goals DISABLE ROW LEVEL SECURITY;
   ALTER TABLE goal_progress DISABLE ROW LEVEL SECURITY;
   ```
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
   
   Update `.env` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-digit-app-password
   SECRET_KEY=any-random-string
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5000`

## 📱 How to Use

### Getting Started
1. **Register/Login**: Create an account or sign in
2. **Create Tasks**: Add one-time tasks with priorities and due dates
3. **Set Goals**: Create repeatable goals with target days (e.g., "Exercise for 30 days")
4. **Build Streaks**: Complete goals daily to build and maintain streaks
5. **Collaborate**: Create workbenches and invite others to work on shared goals

### Task Management
- **Add Task**: Click "Add Task" button, fill in details
- **Set Priority**: Choose High, Medium, or Low priority
- **Due Dates**: Optional due dates for better organization
- **Complete**: Check off tasks when done

### Goal Tracking
- **Create Goal**: Set a title, description, and target days
- **Daily Completion**: Mark goals as complete each day
- **Streak Building**: Consecutive completions build your streak
- **Progress Tracking**: Visual progress bars show your advancement

### Workbench Collaboration
- **Create Workbench**: Set up a collaborative space
- **Invite Others**: Share the invite code with team members
- **Shared Goals**: Add your goals to the workbench for team visibility
- **Real-time Updates**: See live updates when team members complete goals

### Analytics Dashboard
- View completed tasks count
- Track current and best streaks
- Monitor active goals
- Comprehensive progress overview

## ⚙️ Configuration

### Email Notifications
To enable email notifications for streak reminders:

1. **Gmail Setup** (Recommended):
   - Enable 2-Factor Authentication
   - Generate an App Password
   - Use the App Password in `config.py`

2. **Other Email Providers**:
   - Update SMTP settings in `config.py`
   - Adjust port and security settings as needed

### Notification Timing
Modify `NOTIFICATION_CONFIG` in `config.py`:
```python
NOTIFICATION_CONFIG = {
    'STREAK_REMINDER_TIME': '09:00',  # 9 AM daily
    'ENABLE_EMAIL_NOTIFICATIONS': True,
}
```

## 🛠️ Technical Details

### Architecture
- **Backend**: Flask with SQLite database
- **Frontend**: Vanilla JavaScript with modern ES6+
- **Real-time**: Socket.IO for live collaboration
- **Styling**: Custom CSS with glassmorphism design
- **Email**: Flask-Mail with HTML templates
- **Scheduling**: APScheduler for automated tasks

### Database Schema
- **Users**: Authentication and profile data
- **Tasks**: One-time tasks with metadata
- **Goals**: Repeatable goals with streak tracking
- **Workbenches**: Collaborative spaces
- **Goal Progress**: Daily completion records

### Security Features
- Password hashing with Werkzeug
- Session management
- CSRF protection
- Input validation and sanitization

## 🎨 Customization

### Themes
The app supports custom themes. Modify CSS variables in `style.css`:
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --accent: #f093fb;
    /* Add your custom colors */
}
```

### Email Templates
Customize email notifications by editing `templates/email/streak_reminder.html`

## 📊 Features in Detail

### Streak System
- **Daily Tracking**: Goals are tracked daily
- **Streak Calculation**: Consecutive days of completion
- **Best Streak**: Historical best performance
- **Visual Indicators**: Fire icons and progress bars
- **Email Reminders**: Automatic notifications for missed days

### Collaboration
- **Workbench Creation**: Team spaces with unique invite codes
- **Real-time Updates**: Live notifications when team members complete goals
- **Shared Progress**: Team visibility into individual goal progress
- **Member Management**: Track workbench membership

### Analytics
- **Task Completion**: Total completed tasks
- **Streak Metrics**: Current and best streaks
- **Goal Overview**: Active goals count
- **Progress Visualization**: Charts and progress indicators

## 🔧 Development

### Project Structure
```
Modern-To-Do-List/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── streakify.db         # SQLite database (auto-created)
├── static/
│   ├── style.css        # Main stylesheet
│   ├── app.js          # Frontend JavaScript
│   └── auth.css        # Authentication styles
└── templates/
    ├── index.html       # Main application
    ├── login.html       # Login page
    ├── register.html    # Registration page
    └── email/
        └── streak_reminder.html  # Email template
```

### Adding Features
1. **Database Changes**: Update schema in `init_db()` function
2. **API Endpoints**: Add routes in `app.py`
3. **Frontend**: Update JavaScript in `app.js`
4. **Styling**: Modify CSS in `style.css`

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. **Set Environment Variables**:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your-production-secret-key
   ```

2. **Use Production WSGI Server**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Database**: Consider PostgreSQL for production
4. **Email**: Configure production SMTP settings
5. **Security**: Enable HTTPS and secure headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support & Troubleshooting

### Common Issues:

**Registration fails with RLS error:**
```sql
-- Run this in Supabase SQL Editor
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**Supabase connection issues:**
- Verify URL and anon key in `.env`
- Check if tables exist in Supabase dashboard
- Ensure you ran `supabase_setup.sql`

**Email notifications not working:**
- Use Gmail App Password (16 digits)
- Enable 2-Factor Authentication first
- Check spam folder

**General troubleshooting:**
1. Check console output for error messages
2. Verify all dependencies are installed
3. Ensure Supabase project is active
4. Check browser console for JavaScript errors

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with fitness trackers
- [ ] Social features and leaderboards
- [ ] API for third-party integrations
- [ ] Advanced notification options
- [ ] Goal templates and suggestions

---

**Built with ❤️ for productivity enthusiasts and teams who want to build lasting habits together!**