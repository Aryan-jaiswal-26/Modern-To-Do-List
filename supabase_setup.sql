-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table (one-time tasks)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'medium',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Goals table (repeatable targets)
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    target_days INTEGER NOT NULL,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_completed DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Workbenches table (collaborative spaces)
CREATE TABLE workbenches (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id),
    invite_code TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workbench members table
CREATE TABLE workbench_members (
    id SERIAL PRIMARY KEY,
    workbench_id INTEGER REFERENCES workbenches(id),
    user_id INTEGER REFERENCES users(id),
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW()
);

-- Workbench goals table
CREATE TABLE workbench_goals (
    id SERIAL PRIMARY KEY,
    workbench_id INTEGER REFERENCES workbenches(id),
    goal_id INTEGER REFERENCES goals(id),
    added_at TIMESTAMP DEFAULT NOW()
);

-- Goal progress table
CREATE TABLE goal_progress (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER REFERENCES goals(id),
    user_id INTEGER REFERENCES users(id),
    completed_date DATE,
    notes TEXT
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbenches ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbench_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbench_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Tasks are viewable by owner" ON tasks FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Goals are viewable by owner" ON goals FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Goal progress viewable by owner" ON goal_progress FOR ALL USING (auth.uid()::text = user_id::text);