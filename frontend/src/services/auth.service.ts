import api from "../lib/axios";
import { LoginPayload, RegisterPayload } from "../types/auth";

export const RegisterApi = async (Data: RegisterPayload) => {
  const res = await api.post("/auth/register", Data);
  return res.data;
};

export const LoginApi = async (Data: LoginPayload) => {
  const res = await api.post("/auth/login", Data);
  return res.data;
};

export const LogoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const GetCurrentUserApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const RefreshTokenApi = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};
