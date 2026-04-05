import { Task, TaskStatus } from "@/src/types/task";
import React, { useState } from "react";
import styles from "./TaskList.module.css";

type TaskListProps = {
  tasks: Task[];
  onToggleStatus: (id: number) => void;
  onDeleteTask: (id: number) => void;
  setEditId: (id: number | null) => void;
  setSelectedTask: (task: Task | null) => void;
  setShowForm: (show: boolean) => void;
};

const TaskCard = ({
  task,
  onToggleStatus,
  onDeleteTask,
  onEdit,
}: {
  task: Task;
  onToggleStatus: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEdit: (task: Task) => void;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const priorityLabel = { low: "🟢 Low", medium: "🟡 Medium", high: "🔴 High" };
  const toggleLabel =
    task.status === "pending"
      ? "▶ Toggle status"
      : task.status === "in-progress"
        ? "✔ Complete"
        : "↺ Reset";

  return (
    <>
      <div className={`${styles.card} ${styles[task.priority]}`}>
        {/* Top row */}
        <div className={styles.cardTop}>
          <p className={styles.cardTitle}>{task.title}</p>
          <button
            className={styles.deleteBtn}
            onClick={() => setShowConfirm(true)}
            title="Delete task"
          >
            ×
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <p className={styles.cardDesc}>{task.description}</p>
        )}

        {/* Priority badge */}
        <span className={`${styles.badge} ${styles[task.priority]}`}>
          {priorityLabel[task.priority]}
        </span>

        {/* Actions */}
        <div className={styles.cardActions}>
          <button className={styles.editBtn} onClick={() => onEdit(task)}>
            ✎ Edit
          </button>
          <button
            className={styles.toggleBtn}
            onClick={() => onToggleStatus(task.id)}
          >
            {toggleLabel}
          </button>
        </div>
      </div>
      {showConfirm && (
        <div
          className={styles.confirmOverlay}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className={styles.confirmBox}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className={styles.confirmIconWrap}>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className={styles.confirmTitle}>Delete Task?</h3>
            <p className={styles.confirmMessage}>
              Are you sure you want to delete{" "}
              <span className={styles.confirmTaskName}>"{task.title}"</span>?{" "}
              This action cannot be undone.
            </p>

            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={() => {
                  onDeleteTask(task.id);
                  setShowConfirm(false);
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TaskList = ({
  tasks,
  onToggleStatus,
  onDeleteTask,
  setEditId,
  setSelectedTask,
  setShowForm,
}: TaskListProps) => {
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditId(task.id);
    setShowForm(true);
  };

  const statuses: TaskStatus[] = ["pending", "in-progress", "completed"];

  const statusConfig: Record<
    TaskStatus,
    { label: string; headerClass: string; bodyClass: string }
  > = {
    pending: {
      label: "Pending",
      headerClass: styles.pending,
      bodyClass: styles.pending,
    },
    "in-progress": {
      label: "In Progress",
      headerClass: styles.inProgress,
      bodyClass: styles.inProgress,
    },
    completed: {
      label: "Completed",
      headerClass: styles.completed,
      bodyClass: styles.completed,
    },
  };

  const groupedTasks = statuses.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>,
  );

  if (tasks.length === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>No Tasks Yet</h2>
          <p className={styles.emptySubtitle}>
            Hit "+ Add Task" to create your first task
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {statuses.map((status) => {
          const config = statusConfig[status];
          const statusTasks = groupedTasks[status];

          return (
            <div key={status} className={styles.column}>
              {/* Column header */}
              <div className={`${styles.columnHeader} ${config.headerClass}`}>
                <div className={styles.columnHeaderLeft}>
                  <span className={styles.columnTitle}>{config.label}</span>
                  <span className={styles.columnCount}>
                    {statusTasks.length}
                  </span>
                </div>
              </div>

              {/* Column body */}
              <div className={`${styles.columnBody} ${config.bodyClass}`}>
                {statusTasks.length === 0 ? (
                  <div className={styles.columnEmpty}>No tasks here</div>
                ) : (
                  statusTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleStatus={onToggleStatus}
                      onDeleteTask={onDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
