# Streakify API Documentation

## Overview

Streakify provides a RESTful API built with Next.js API routes. All endpoints require authentication except for the auth routes.

## Authentication

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

### NextAuth Endpoints
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- Handles sign-in, sign-out, and session management

## Tasks API

### GET `/api/tasks`
Retrieve all tasks for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "notes": "Finish the final touches",
    "dueDate": "2024-01-15T10:00:00Z",
    "completed": false,
    "createdAt": "2024-01-10T08:00:00Z"
  }
]
```

### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "New task",
  "notes": "Optional notes",
  "dueDate": "2024-01-15T10:00:00Z"
}
```

### PUT `/api/tasks/[taskId]`
Update an existing task.

**Request Body:**
```json
{
  "title": "Updated task",
  "notes": "Updated notes",
  "completed": true
}
```

### DELETE `/api/tasks/[taskId]`
Delete a task.

## Goals API

### GET `/api/goals`
Retrieve all goals for the authenticated user (personal and workspace goals).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Daily Exercise",
    "description": "Exercise for 30 minutes",
    "scheduleType": "daily",
    "scheduleDays": [],
    "workspaceId": null,
    "ownerId": 1,
    "createdAt": "2024-01-10T08:00:00Z",
    "workspace": null,
    "completions": [
      {
        "date": "2024-01-10"
      }
    ]
  }
]
```

### POST `/api/goals`
Create a new goal.

**Request Body:**
```json
{
  "title": "Daily Reading",
  "description": "Read for 30 minutes daily",
  "scheduleType": "daily",
  "scheduleDays": [],
  "workspaceId": null
}
```

### PUT `/api/goals/[goalId]`
Update an existing goal.

### DELETE `/api/goals/[goalId]`
Delete a goal.

### POST `/api/goals/[goalId]/complete`
Mark a goal as completed for today.

**Response:**
```json
{
  "message": "Goal completed for today",
  "streak": 5
}
```

### GET `/api/goals/[goalId]/streak`
Get streak information for a goal.

**Response:**
```json
{
  "currentStreak": 5,
  "bestStreak": 12,
  "totalCompletions": 25
}
```

## Workspaces API

### GET `/api/workspaces`
Retrieve all workspaces for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Team Fitness",
    "role": "owner"
  }
]
```

### POST `/api/workspaces`
Create a new workspace.

**Request Body:**
```json
{
  "name": "New Team Workspace"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "New Team Workspace",
  "created_at": "2024-01-10T08:00:00Z",
  "inviteCodes": [
    {
      "id": 1,
      "code": "ABC123XY",
      "expires_at": "2024-01-17T08:00:00Z"
    }
  ]
}
```

### GET `/api/workspaces/[workspaceId]`
Get workspace details including members and goals.

### PUT `/api/workspaces/[workspaceId]`
Update workspace information (owner only).

### DELETE `/api/workspaces/[workspaceId]`
Delete a workspace (owner only).

### GET `/api/workspaces/[workspaceId]/members`
Get workspace members.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "owner",
    "joinedAt": "2024-01-10T08:00:00Z"
  }
]
```

### GET `/api/workspaces/[workspaceId]/goals`
Get goals specific to a workspace.

### GET `/api/workspaces/[workspaceId]/feed`
Get activity feed for a workspace.

**Response:**
```json
[
  {
    "id": 1,
    "type": "goal_completed",
    "user": "John Doe",
    "goal": "Daily Exercise",
    "timestamp": "2024-01-10T08:00:00Z"
  }
]
```

## Invite Codes API

### GET `/api/invite-codes`
Get invite codes for workspaces owned by the user.

### POST `/api/invite-codes`
Generate a new invite code for a workspace.

**Request Body:**
```json
{
  "workspaceId": 1,
  "expiresIn": 7
}
```

### POST `/api/invite-codes/join`
Join a workspace using an invite code.

**Request Body:**
```json
{
  "code": "ABC123XY"
}
```

## Dashboard API

### GET `/api/dashboard/stats`
Get dashboard statistics for the authenticated user.

**Response:**
```json
{
  "tasksCompleted": 25,
  "activeGoals": 5,
  "currentStreaks": 3,
  "bestStreak": 15,
  "workspaces": 2
}
```

## Theme API

### GET `/api/theme`
Get user's theme preference.

### POST `/api/theme`
Update user's theme preference.

**Request Body:**
```json
{
  "theme": "dark"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production deployments.

## Authentication Headers

For authenticated requests, include the session cookie automatically handled by NextAuth.js. No manual token management required.

## Data Validation

All request bodies are validated using Zod schemas. Validation errors return detailed field-level error messages.

## Real-time Updates

While the API is RESTful, consider implementing WebSocket connections for real-time workspace updates in future versions.