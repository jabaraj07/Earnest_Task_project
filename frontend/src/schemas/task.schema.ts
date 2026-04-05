import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(250, "Description must be less than 250 characters"),
  priority: z.enum(
    ["low", "medium", "high"],
    "Priority must be low, medium or high",
  ),
  status: z.enum(
    ["pending", "in-progress", "completed"],
    "Status must be pending, in-progress or completed",
  ),
});

export type CreateTaskType = z.infer<typeof TaskSchema>;
