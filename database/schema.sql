-- Drop existing tables if they exist
DROP TABLE IF EXISTS goal_progress CASCADE;
DROP TABLE IF EXISTS workbench_goals CASCADE;
DROP TABLE IF EXISTS workbench_members CASCADE;
DROP TABLE IF EXISTS workbenches CASCADE;
DROP TABLE IF EXISTS goal_completions CASCADE;
DROP TABLE IF EXISTS invite_codes CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces table (renamed from workbenches)
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workspace members table
CREATE TABLE workspace_members (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Goals table (updated schema)
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    schedule_type TEXT NOT NULL DEFAULT 'daily',
    schedule_days INTEGER[] DEFAULT '{}',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (user_id IS NOT NULL OR workspace_id IS NOT NULL)
);

-- Goal completions table (renamed from goal_progress)
CREATE TABLE goal_completions (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(goal_id, user_id, date)
);

-- Invite codes table (new)
CREATE TABLE invite_codes (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_workspace_id ON goals(workspace_id);
CREATE INDEX idx_goals_owner_id ON goals(owner_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_goal_completions_goal_id ON goal_completions(goal_id);
CREATE INDEX idx_goal_completions_user_id ON goal_completions(user_id);
CREATE INDEX idx_invite_codes_code ON invite_codes(code);

-- Enable Row Level Security (but disable for now since using custom auth)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE goal_completions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies commented out since the app uses custom authentication
-- If you want to enable RLS later, you'll need to modify the auth system
-- to work with Supabase Auth instead of NextAuth with credentials