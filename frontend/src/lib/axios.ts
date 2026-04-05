import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { RefreshTokenApi } from "../services/auth.service";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const requestUrl = originalRequest.url || "";

    const excludedRoutes = ["/auth/login", "/auth/register"];

    const shouldSkipRefresh = excludedRoutes.some((route) =>
      requestUrl.includes(route),
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await RefreshTokenApi();

        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (value?: unknown) => void;
//   reject: (reason?: unknown) => void;
// }[] = [];

// const processQueue = (error: unknown = null) => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else {
//       promise.resolve();
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,

//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     const requestUrl = originalRequest?.url || "";

//     // ✅ Only exclude the refresh endpoint itself
//     // Removed /auth/me so it can be retried after token refresh
//     const excludedRoutes = [
//       "/auth/login",
//       "/auth/register",
//       "/auth/refresh",
//       "/auth/logout",
//     ];

//     const shouldSkipRefresh = excludedRoutes.some((route) =>
//       requestUrl.includes(route)
//     );

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !shouldSkipRefresh
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => api(originalRequest));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // ✅ Use plain axios to avoid triggering this interceptor again
//         await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         processQueue();
//         return api(originalRequest); // ✅ retry original request
//       } catch (refreshError) {
//         processQueue(refreshError);

//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
