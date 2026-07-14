import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const wallpaperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  characterId: z.string().optional(),
  resolution: z.string().optional(),
  deviceType: z.enum(["PHONE", "TABLET", "PC"]),
  format: z.enum(["IMAGE", "GIF", "VIDEO"]),
  isPremium: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
  parentCommentId: z.string().optional(),
})

export const characterRequestSchema = z.object({
  characterName: z.string().min(1, "Character name is required"),
  note: z.string().optional(),
})

export const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})
