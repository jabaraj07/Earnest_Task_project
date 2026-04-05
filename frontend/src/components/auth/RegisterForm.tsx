// "use client";

// import React from "react";
// import { RegisterApi } from "@/src/services/auth.service";
// import { RegisterPayload } from "@/src/types/auth";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { registerSchema } from "@/src/schemas/auth.schema";
// import toast from "react-hot-toast";

// const RegisterForm = () => {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterPayload>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   const handleRegisterSubmit = async (data: RegisterPayload) => {
//     try {
//       const res = await RegisterApi(data);
//       reset();
//       toast.success(res.message || "Registered Successfully");
//       setTimeout(() => {
//         router.push("/login");
//       }, 1000);
//     } catch (error: any) {
//       const message = error?.response?.data?.message || "Registration failed";
//       toast.error(message);
//       console.error("Registration Error: ", error);
//     }
//   };
//   return (
//     <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-slate-100">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
//         <p className="text-slate-600 text-sm">Join us to manage your tasks efficiently</p>
//       </div>

//       <form className="space-y-5" onSubmit={handleSubmit(handleRegisterSubmit)}>
//         <div>
//           <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
//             Full Name
//           </label>
//           <input
//             id="name"
//             type="text"
//             {...register("name")}
//             required
//             placeholder="John Doe"
//             className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
//           />
//           {errors.name && (
//             <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
//           )}
//         </div>

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
//           {isSubmitting ? "Creating account..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;

"use client";

import React from "react";
import { RegisterApi } from "@/src/services/auth.service";
import { RegisterPayload } from "@/src/types/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/src/schemas/auth.schema";
import toast from "react-hot-toast";
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleRegisterSubmit = async (data: RegisterPayload) => {
    try {
      const res = await RegisterApi(data);
      reset();
      toast.success(res.message || "Registered Successfully");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join us to manage your tasks efficiently</p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit(handleRegisterSubmit)}>

            {/* Full Name */}
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input id="name" type="text" {...register("name")}
                placeholder="John Doe" className={styles.input} />
              {errors.name && (
                <p className={styles.errorText}>⚠ {errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input id="email" type="email" {...register("email")}
                placeholder="you@example.com" className={styles.input} />
              {errors.email && (
                <p className={styles.errorText}>⚠ {errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input id="password" type="password" {...register("password")}
                placeholder="Min. 6 characters" className={styles.input} />
              {errors.password && (
                <p className={styles.errorText}>⚠ {errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? (
                <span className={styles.spinnerRow}>
                  <svg className={styles.spinner} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>

            <p className={styles.footer}>
              Already have an account?{" "}
              <a href="/login" className={styles.link}>Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;