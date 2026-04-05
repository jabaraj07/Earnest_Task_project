"use client";

import TaskForm from "@/src/components/task/TaskForm";
import TaskList from "@/src/components/task/TaskList";
import { GetCurrentUserApi, LogoutApi } from "@/src/services/auth.service";
import {
  deleteTask,
  getAllTasks,
  toggleTaskStatus,
} from "@/src/services/task.service";
import { Task } from "@/src/types/task";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./page.module.css";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTask = useCallback(async (pageNo: number, lim: number) => {
    try {
      const res = await getAllTasks(pageNo, lim);
      setTasks(res.Data);
      setPage(res.pagination.currentPage);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.totalTasks ?? 0);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await GetCurrentUserApi();
        await fetchTask(1, limit);
      } catch (error: any) {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          router.replace("/login");
        } else {
          console.error("Auth check failed:", error);
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, fetchTask, limit]);

  const handleLogout = async () => {
    try {
      await LogoutApi();
      toast.success("Logged out successfully");
      setTimeout(() => router.replace("/login"), 1000);
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
      router.replace("/login");
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    await fetchTask(newPage, limit);
  };

  const ToggleStatus = async (id: number) => {
    try {
      const res = await toggleTaskStatus(id);
      toast.success(res.message || "Task status updated");
      await fetchTask(page, limit);
    } catch {
      toast.error("Failed to update task status");
    }
  };

  const DeleteTask = async (id: number) => {
    try {
      const res = await deleteTask(id);
      toast.success(res.message || "Task deleted");
      // If last item on page > 1, go back one page
      const newPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      await fetchTask(newPage, limit);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setSelectedTask(null);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ margin: 0 }}>Task Board</h1>
              {totalRecords > 0 && (
                <span className={styles.record}>{totalRecords} Tasks</span>
              )}
            </div>
            <p>Manage and organize your tasks</p>
          </div>
          <div className={styles.headerRight}>
            {!showForm && (
              <button
                className={styles.addBtn}
                onClick={() => {
                  setShowForm(true);
                  setEditId(null);
                  setSelectedTask(null);
                }}
              >
                + Add Task
              </button>
            )}
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div className={styles.overlay} onClick={closeForm}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={closeForm}>
                ×
              </button>
              <TaskForm
                editId={editId}
                selectedTask={selectedTask}
                onSuccess={async () => {
                  await fetchTask(page, limit);
                  closeForm();
                }}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onToggleStatus={ToggleStatus}
          onDeleteTask={DeleteTask}
          setEditId={setEditId}
          setSelectedTask={setSelectedTask}
          setShowForm={setShowForm}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {/* Prev */}
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              title="Previous page"
            >
              ←
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className={styles.paginationDots}>
                  •••
                </span>
              ) : (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ""}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ),
            )}

            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              title="Next page"
            >
              →
            </button>

            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
