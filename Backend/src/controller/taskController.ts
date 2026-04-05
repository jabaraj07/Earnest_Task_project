import { Request, Response } from "express";
import { taskSchema, updateTaskSchema } from "../validations/auth.validation";
import { z } from "zod";
import prisma from "../prisma";

export const GetAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || 5, 1),
      20,
    );
    const skip = (page - 1) * limit;

    const Task = await prisma.task.findMany({
      where: { userId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalTasks = await prisma.task.count({
      where: { userId: userId },
    });
    const totalPages = Math.ceil(totalTasks / limit);
    return res.status(200).json({
      message: "Tasks fetched successfully",
      Data: Task,
      pagination: {
        currentPage: page,
        limit,
        totalPages,
        totalTasks,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const AddTask = async (req: Request, res: Response) => {
  try {
    const validateData = taskSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: z.treeifyError(validateData.error),
      });
    }

    const { title, status, description, priority } = req.body;
    const userId = req.user?.id;

    const newTask = await prisma.task.create({
      data: {
        title,
        status: status || "pending",
        description: description || "",
        priority : priority || "medium",
        userId: userId as number,
      },
    });

    return res
      .status(201)
      .json({ message: "Task created Successfully", Task: newTask });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetSingleTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: Number(id),
        userId: userId,
      },
    });
    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Task fetched successfully", Task: task });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const DeleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    await prisma.task.delete({
      where: {
        id: Number(id),
        userId: userId,
      },
    });
    return res.status(200).json({ message: "Task Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const validateData = updateTaskSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: "Validation failed",
        Errors: z.treeifyError(validateData.error),
      });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: Number(id),
        userId: userId,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    const { title, description, priority,status } = req.body;

    const Updatedata: {
      title?: string;
      description?: string;
      priority?: string;
      status?:string;
    } = {};

    if (title !== undefined) {
      Updatedata.title = title;
    }
    if (description !== undefined) {
      Updatedata.description = description;
    }
    if (priority !== undefined) {
      Updatedata.priority = priority;
    }

    if(status !== undefined){
      Updatedata.status = status;
    }

    const AfterUpdateTask = await prisma.task.update({
      where: {
        id: Number(id),
        userId: userId,
      },
      data: Updatedata,
    });
    return res
      .status(200)
      .json({ message: "Task Updated Successfully", Task: AfterUpdateTask });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const ToggleStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: Number(id),
        userId: userId,
      },
    });
    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }
    const newStatus = task.status === "pending" ? "completed" : "pending";

    const updatedTask = await prisma.task.update({
      where: {
        id: Number(id),
        userId,
      },
      data: {
        status: newStatus,
      },
    });
    return res
      .status(200)
      .json({ message: "Task status toggled successfully", Task: updatedTask });
  } catch (error) {
    console.error("Error toggling task status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
