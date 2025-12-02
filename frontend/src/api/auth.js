// src/api/auth.js
import { api } from "./api";

export const signup = (payload) =>
  api.post("/auth/signup", payload);

export const login = (payload) =>
  api.post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

export const me = () =>
  api
    .get("/auth/me")
    .then((r) => r.data)
    .catch(() => null);
