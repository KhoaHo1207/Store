// import { UserTypes } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ENV } from "@/utils/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
interface AuthContextProps {
  // user: UserProps | null;
  token: string | null;
  loading: boolean;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signup: ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  // const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        router.replace("/(main)");
      } else {
        router.replace("/(auth)/login");
      }
    } catch (error: any) {
      console.log("Something went wrong while checking token", error);
      throw error;
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const resposne = await axios.post(`${ENV.API_URL}/auth/login`, {
        email: email,
        password: password,
      });
      setLoading(false);
      if (resposne.data.success) {
        Toast.show({
          type: "success",
          text1: "Login successfully",
        });
        setToken(resposne.data.token);
        await AsyncStorage.setItem("token", resposne.data.token);
        router.replace("/(main)");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Something went wrong when login",
      });
      console.log("Something went wrong when login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setToken(null);
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.log("Something went wrong while logout", error);
      throw error;
    }
  };

  const signup = async ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(`${ENV.API_URL}/auth/register`, {
        email: email,
        username: username,
        password: password,
        avatar:
          "https://file3.qdnd.vn/data/images/0/2025/09/12/upload_2077/portugal_v_slovakia_group_j_-_uefa_euro_2024_european_qualifiers.jpeg?dpi=150&quality=100&w=870",
      });
      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Signup successfully",
        });
        router.replace("/(auth)/login");
      }
    } catch (error: any) {
      console.log("Something went wrong while singup", error);
      throw error;
    }
  };

  useEffect(() => {
    checkToken();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        // user,
        // setUser,
        token,
        setToken,
        loading,
        setLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
