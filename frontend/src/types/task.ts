export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type CreateTaskPayload = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
};

export type updateTaskPayload = Partial<CreateTaskPayload>;

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
};