// src/api/auth.js
import API from "../utils/axios";

export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const register = (formData) =>
  API.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


/** profile (backend should verify token and return user info) */
export const getProfile = (token) =>
  API.get("/auth/user-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });