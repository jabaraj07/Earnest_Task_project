// "use client";
// import { CreateTaskType, TaskSchema } from "@/src/schemas/task.schema";
// import { createtask, updateTask } from "@/src/services/task.service";
// import { CreateTaskPayload, Task } from "@/src/types/task";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// type TaskFormProps = {
//   selectedTask?: Task | null;
//   editId?: number | null;
//   onSuccess?: () => void;
// };

// const TaskForm = ({ editId, selectedTask, onSuccess }: TaskFormProps) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<CreateTaskType>({
//     resolver: zodResolver(TaskSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       priority: "medium",
//       status: "pending",
//     },
//   });

//   useEffect(() => {
//     if (editId && selectedTask) {
//       reset({
//         title: selectedTask.title,
//         description: selectedTask.description,
//         priority: selectedTask.priority,
//         status: selectedTask.status,
//       });
//     } else {
//       reset({
//         title: "",
//         description: "",
//         priority: "medium",
//         status: "pending",
//       });
//     }
//   }, [editId, selectedTask, reset]);

//   const onSubmit = async (Data: CreateTaskType) => {
//     try {
//       if (editId) {
//         const res = await updateTask(editId, Data);
//         toast.success(res.message || "Task updated successfully");
//       } else {
//         const res = await createtask(Data);
//         toast.success(res.message || "Task created successfully");
//       }

//       reset({
//         title: "",
//         description: "",
//         priority: "low",
//         status: "pending",
//       });

//       onSuccess?.();
//     } catch (error: any) {
//       const message = error?.response?.data?.message || "Something Went Wrong";
//       toast.error(message);
//       console.error("Registration Error: ", error);
//     }
//   };
//   return (
//     <div className="w-full bg-white p-5 sm:p-6 rounded-3xl shadow-2xl border border-slate-200">
//       <div className="mb-6 text-center">
//         <p className="text-sm uppercase tracking-[0.3em] text-sky-600 font-semibold mb-2">
//           Task Form
//         </p>
//         <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
//           {editId ? "Edit Task" : "Add Task"}
//         </h1>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
//             Title
//           </label>
//           <input
//             id="title"
//             type="text"
//             placeholder="Enter Title"
//             {...register("title")}
//             className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
//             required
//           />
//           {errors.title && (
//             <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
//             Description
//           </label>
//           <textarea
//             id="description"
//             {...register("description")}
//             placeholder="Enter detail about the task"
//             rows={4}
//             className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 resize-none"
//             required
//           />
//           {errors.description && (
//             <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
//           )}
//         </div>

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div>
//             <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
//               Priority
//             </label>
//             <select
//               id="priority"
//               {...register("priority")}
//               className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 appearance-none"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
//               Status
//             </label>
//             <select
//               id="status"
//               {...register("status")}
//               className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 appearance-none"
//             >
//               <option value="pending">Pending</option>
//               <option value="in-progress">In-progress</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
//         </div>

//         <button
//           className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
//           type="submit"
//           disabled={isSubmitting}
//         >
//           {editId ? (isSubmitting ? "Updating..." : "Update Task") : isSubmitting ? "Creating..." : "Create Task"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TaskForm;

























"use client";

import { CreateTaskType, TaskSchema } from "@/src/schemas/task.schema";
import { createtask, updateTask } from "@/src/services/task.service";
import { Task } from "@/src/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styles from "./TaskForm.module.css";

type TaskFormProps = {
  selectedTask?: Task | null;
  editId?: number | null;
  onSuccess?: () => void;
};

const TaskForm = ({ editId, selectedTask, onSuccess }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskType>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
    },
  });

  useEffect(() => {
    if (editId && selectedTask) {
      reset({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
        status: selectedTask.status,
      });
    } else {
      reset({ title: "", description: "", priority: "medium", status: "pending" });
    }
  }, [editId, selectedTask, reset]);

  const onSubmit = async (data: CreateTaskType) => {
    try {
      if (editId) {
        const res = await updateTask(editId, data);
        toast.success(res.message || "Task updated successfully");
      } else {
        const res = await createtask(data);
        toast.success(res.message || "Task created successfully");
      }
      reset({ title: "", description: "", priority: "medium", status: "pending" });
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Task submit error:", error);
    }
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.badge}>Task Form</span>
        <h1 className={styles.title}>{editId ? "Edit Task" : "Add Task"}</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            {...register("title")}
            className={styles.input}
          />
          {errors.title && (
            <p className={styles.errorText}>⚠ {errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            placeholder="Enter detail about the task"
            rows={4}
            {...register("description")}
            className={styles.textarea}
          />
          {errors.description && (
            <p className={styles.errorText}>⚠ {errors.description.message}</p>
          )}
        </div>

        {/* Priority & Status */}
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="priority" className={styles.label}>Priority</label>
            <select id="priority" {...register("priority")} className={styles.select}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <select id="status" {...register("status")} className={styles.select}>
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? (
            <span className={styles.spinnerRow}>
              <svg className={styles.spinner} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"
                  style={{ opacity: 0.25 }} />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"
                  style={{ opacity: 0.75 }} />
              </svg>
              {editId ? "Updating..." : "Creating..."}
            </span>
          ) : editId ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;