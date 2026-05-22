import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-hot-toast";

// axios global configuration
axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}`;
axios.defaults.withCredentials = true;

export const useAuth = create(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      isAuthChecked: false,
      error: null,

      // LOGIN
      login: async (userCredWithRole) => {
        const { role, ...userObj } = userCredWithRole;

        try {
          set({ loading: true, error: null });

          const res = await axios.post("/common-api/login", userObj);

          console.log("res is ", res);

          set({
            loading: false,
            error: null,
            isAuthChecked: true,
            isAuthenticated: true,
            currentUser: res.data.payload,
          });

          toast.success("Login successful");
        } catch (err) {
          console.log("err is ", err);

          const errorMessage = err.response?.data?.error || err.message || "Login failed";

          set({
            loading: false,
            isAuthChecked: true,
            isAuthenticated: false,
            currentUser: null,
            error: errorMessage,
          });

          toast.error(errorMessage);
        }
      },

      // LOGOUT
      logout: async () => {
        try {
          set({ loading: true, error: null });

          const res = await axios.get("/common-api/logout");

          console.log("res is ", res);

          set({
            loading: false,
            isAuthChecked: true,
            isAuthenticated: false,
            currentUser: null,
          });

          toast.success("Logout successful");
        } catch (err) {
          console.log("err is ", err);

          set({
            loading: false,
            isAuthChecked: true,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Logout failed",
          });

          toast.error("Logout failed");
        }
      },

      checkAuth: async () => {
        try {
          set({ loading: true, error: null });

          const res = await axios.get("/common-api/check-auth");

          console.log("res is ", res);

          set({
            loading: false,
            isAuthChecked: true,
            isAuthenticated: true,
            currentUser: res.data.payload,
          });
        } catch (err) {
          console.log("err is", err);

          set({
            loading: false,
            isAuthChecked: true,
            isAuthenticated: false,
            currentUser: null,
            error: [401, 403].includes(err.response?.status)
              ? null
              : err.response?.data?.error || "Authentication check failed",
          });
        }
      },
    }),
    {
      name: "blogapp-auth-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);