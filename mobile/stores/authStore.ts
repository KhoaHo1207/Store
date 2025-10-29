import {
  fetchCurrentUserService,
  loginService,
  signupService,
  updateProfileService,
} from "@/services/authService";
import { UserTypes } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { create } from "zustand";

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
  updateProfile: ({
    fullName,
    phone,
    address,
    avatar,
  }: {
    fullName: string;
    phone: string;
    address: string;
    avatar?: string;
  }) => Promise<void>;
}

export const useAuthStore = create<UserState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  checkToken: async (): Promise<string | null> => {
    try {
      const availableToken = await AsyncStorage.getItem("token");
      if (!availableToken) {
        set({ token: null });
        return null;
      }
      set({ token: availableToken });
      return availableToken;
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
        await AsyncStorage.setItem("token", response.token);
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
    await AsyncStorage.removeItem("token");
    set({ token: null });
    Toast.show({ type: "info", text1: "Logged out" });
    router.replace("/(auth)/login");
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

  updateProfile: async ({
    fullName,
    phone,
    address,
    avatar,
  }: {
    fullName: string;
    phone: string;
    address: string;
    avatar?: string;
  }): Promise<void> => {
    try {
      set({
        error: null,
      });
      const res = await updateProfileService({
        fullName,
        phone,
        address,
        avatar,
      });
      if (res.success) {
        Toast.show({
          type: "success",
          text1: "Profile updated successfully",
        });
        await useAuthStore.getState().fetchCurrentUser();
      } else {
        Toast.show({
          type: "error",
          text1: res.message || "Failed to update profile",
        });
        set({
          error: res.message || "Failed to update profile",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "An error occurred while updating profile",
      });
      set({
        error: error?.message || "An error occurred while updating profile",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
