// src/store/useAuthStore.js
import axios from "../api/api.js";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoading: false,
  error: null,
  user: null,

  /* ---------------- SIGNUP ---------------- */

  signup: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axios.post("/auth/signup", data);

      set({
        user: res.data.user,
        isLoading: false,
      });

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message); // ✅ important
    }
  },

  /* ---------------- LOGIN ---------------- */

  login: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axios.post("/auth/login", data);

      set({
        user: res.data.user,
        isLoading: false,
      });

      return res.data; // ✅ success response
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message); // 🔥 required fix
    }
  },

  /* ---------------- LOGOUT ---------------- */

  logout: async () => {
    try {
      set({ isLoading: true });

      await axios.post("/auth/logout");

      set({
        user: null,
        isLoading: false,
      });
    } catch (err) {
      const message = err.response?.data?.message || "Logout failed";

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message);
    }
  },

  /* ---------------- CHECK AUTH ---------------- */

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const res = await axios.get("/auth/me");

      set({
        user: res.data.user,
        isLoading: false,
      });
    } catch (err) {
      set({
        user: null,
        isLoading: false,
      });
    }
  },
}));
