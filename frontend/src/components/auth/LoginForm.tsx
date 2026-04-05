// "use client";

// import React from "react";
// import { LoginApi } from "@/src/services/auth.service";
// import { LoginPayload } from "@/src/types/auth";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema } from "@/src/schemas/auth.schema";
// import toast from "react-hot-toast";

// const LoginForm = () => {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginPayload>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const handleLoginSubmit = async (data: LoginPayload) => {
//     try {
//       const res = await LoginApi(data);
//       reset();
//       toast.success(res.message || "Logged in Successfully");
//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 1000);
//     } catch (error: any) {
//       const message = error?.response?.data?.message || "Login failed";
//       toast.error(message);
//       console.error("Login Error: ", error);
//     }
//   };
//   return (
//     <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-slate-100">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
//         <p className="text-slate-600 text-sm">Sign in to your account to continue</p>
//       </div>

//       <form className="space-y-5" onSubmit={handleSubmit(handleLoginSubmit)}>
//         <div>
//           <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
//             Email Address
//           </label>
//           <input
//             id="email"
//             type="email"
//             {...register("email")}
//             required
//             placeholder="you@example.com"
//             className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             {...register("password")}
//             required
//             placeholder="Enter your password"
//             className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
//           />
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
//           )}
//         </div>

//         <button
//           className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-2xl font-semibold transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
//           type="submit"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Signing in..." : "Sign In"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;













"use client";

import React from "react";
import { LoginApi } from "@/src/services/auth.service";
import { LoginPayload } from "@/src/types/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/src/schemas/auth.schema";
import toast from "react-hot-toast";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLoginSubmit = async (data: LoginPayload) => {
    try {
      const res = await LoginApi(data);
      reset();
      toast.success(res.message || "Logged in Successfully");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.error("Login Error: ", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* Gradient accent bar */}
        <div className={styles.accentBar} />

        <div className={styles.body}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconBox}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit(handleLoginSubmit)}>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className={styles.input}
              />
              {errors.email && (
                <p className={styles.errorText}>⚠ {errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className={styles.input}
              />
              {errors.password && (
                <p className={styles.errorText}>⚠ {errors.password.message}</p>
              )}
              {/* Forgot password link sits below the field */}
              <div className={styles.forgotRow}>
                <a href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </a>
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
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

            <p className={styles.footer}>
              Don&apos;t have an account?{" "}
              <a href="/register" className={styles.link}>Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;