import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "@/utils/env";

const axiosConfig = axios.create({
  baseURL: ENV.API_URL,
  timeout: 100000000000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosConfig.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Token hết hạn hoặc không hợp lệ.");
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
