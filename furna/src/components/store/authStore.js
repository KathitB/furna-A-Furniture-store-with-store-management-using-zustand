import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "../../api/api";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  sessionExpired: false,
  isLoading: false,
};

export const useAuthsStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          sessionExpired: false,
        }),

      loginWithCredentials: async (email, password) => {
        set({ isLoading: true });

        try {
          const { user, token } = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          set({
            user,
            token,
            isAuthenticated: true,
            sessionExpired: false,
            isLoading: false,
          });

          return { user, token };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => set({ ...initialState }),
      setSessionExpired: (val) => set({ sessionExpired: val }),
      setIsLoading: (val) => set({ isLoading: val }),

      hydrateAuth: () => {
        const token = get().token;
        if (token) {
          set({ isAuthenticated: true });
        }
      },
    }),

    {
      name: "auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
