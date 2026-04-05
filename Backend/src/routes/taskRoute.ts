import express from "express";
import {
  GetAllTasks,
  AddTask,
  GetSingleTask,
  DeleteTask,
  UpdateTask,
  ToggleStatus,
} from "../controller/taskController";
import { authMiddleware } from "../middleware/authMiddleware";
const route = express.Router();

route.get("/", authMiddleware, GetAllTasks);
route.post("/", authMiddleware, AddTask);

route.get("/:id", authMiddleware, GetSingleTask);
route.delete("/:id", authMiddleware, DeleteTask);
route.patch("/:id", authMiddleware, UpdateTask);
route.patch("/:id/toggle", authMiddleware, ToggleStatus);

export default route;
