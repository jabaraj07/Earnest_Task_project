import api from "../lib/axios";
import { CreateTaskPayload, updateTaskPayload } from "../types/task";

export const createtask = async (Data: CreateTaskPayload) => {
  const res = await api.post("/tasks", Data);
  return res.data;
};

export const getAllTasks = async (page = 1, limit = 5) => {
  const res = await api.get(`/tasks?page=${page}&limit=${limit}`);
  return res.data;
};

export const toggleTaskStatus = async (id:number) => {
    const res = await api.patch(`/tasks/${id}/toggle`);
    return res.data;
}

export const deleteTask = async (id:number) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
}

export const updateTask = async (id:number,Data:updateTaskPayload) => {
    const res = await api.patch(`/tasks/${id}`,Data);
    return res.data;
}