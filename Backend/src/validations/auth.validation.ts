import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is Required" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z.email("Invalid Email Address").trim().toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const loginSchema = z.object({
  email: z.email("Invalid Email Address").trim().toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Minimum 1 character required for Title" })
    .max(100, { message: "Maximum 100 character required for title" }),
  status: z.enum(["pending", "in-progress", "completed"], {
    message: "Status must be either pending,in-progress or completed",
  }),
  description: z
    .string()
    .max(250, { message: "Maximum 250 characters allowed for description" }),
  priority: z.enum(["low", "medium", "high"], {
    message: "priority must be either low, medium or high",
  }),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Minimum 2 character required for Title" })
      .max(100, { message: "Maximum 100 character required for Title" })
      .optional(),
    description: z
      .string()
      .min(2, { message: "Minimum 2 character required for description" })
      .max(250, { message: "Maximum250 character required for description" })
      .optional(),
    priority: z
      .enum(["low", "medium", "high"], {
        message: "priority must be either low, medium or high",
      })
      .optional(),
    status: z
      .enum(["pending", "in-progress", "completed"], {
        message: "Status must be either pending,in-progress or completed",
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined,
    {
      message:
        "At least one field (title, description or priority) must be provided",
    },
  );
