import {
  fetchCurrentUserService,
  loginService,
  signupService,
} from "@/services/authService";
import { UserTypes } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: UserTypes | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  checkToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    fullName: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      checkToken: async (): Promise<string | null> => {
        try {
          const raw = await AsyncStorage.getItem("auth-storage");
          if (!raw) {
            set({ token: null });
            return null;
          }
          const data = JSON.parse(raw);
          const token = data?.state?.token || null;
          set({ token });
          return token;
        } catch (error) {
          console.log("Failed to check token:", error);
          set({ token: null });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      login: async (email: string, password: string): Promise<boolean> => {
        try {
          const response = await loginService({ email, password });
          if (response.success) {
            Toast.show({
              type: "success",
              text1: "Login successfully",
            });
            set({
              token: response.token,
            });
            return true;
          } else {
            Toast.show({
              type: "error",
              text1: response.message || "Failed to login",
            });
            set({
              error: response.message || "Failed to login",
            });
            return false;
          }
        } catch (error: any) {
          Toast.show({
            type: "error",
            text1: error?.message || "Failed to login",
          });
          console.log("Failed to login", error);
          set({
            error: error?.message || "Failed to login",
          });
          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      signup: async (
        email: string,
        fullName: string,
        password: string
      ): Promise<boolean> => {
        try {
          const response = await signupService({ email, password, fullName });
          if (response.success) {
            Toast.show({
              type: "success",
              text1: "Signup successfully",
            });

            return true;
          } else {
            Toast.show({
              type: "error",
              text1: response.message || "Failed to signup",
            });
            set({
              error: response.message || "Failed to signup",
            });
            return false;
          }
        } catch (error: any) {
          Toast.show({
            type: "error",
            text1: error?.message || "Failed to signup",
          });
          console.log("Failed to signup", error);
          set({
            error: error?.message || "Failed to signup",
          });
          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      logout: async () => {
        await AsyncStorage.removeItem("auth-storage");
        set({ token: null });
        Toast.show({ type: "info", text1: "Logged out" });
      },

      fetchCurrentUser: async (): Promise<void> => {
        try {
          set({
            error: null,
          });
          const res = await fetchCurrentUserService();
          if (res.success) {
            set({
              user: res.data,
            });
          } else {
            set({
              error: res.message || "Failed to fetch user",
            });
          }
        } catch (error: any) {
          set({
            error: error?.message || "An error occurred while fetching user",
          });
        } finally {
          set({
            loading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);
