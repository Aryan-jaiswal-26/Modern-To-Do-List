import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const taskSchema = z.object({
  title: z.string().min(1),
  notes: z.string().max(1000).optional(),
  dueDate: z.coerce.date().optional(),
  completed: z.boolean().optional()
});

export const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().max(1000).optional(),
  scheduleType: z.enum(["daily", "weekdays", "custom"]),
  scheduleDays: z.array(z.number().min(0).max(6)).optional(),
  workspaceId: z.string().optional()
});

export const inviteSchema = z.object({
  workspaceId: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val) : val),
  expiresAt: z.string().datetime().nullable().optional()
});

export const joinWorkspaceSchema = z.object({
  code: z.string().min(6)
});
