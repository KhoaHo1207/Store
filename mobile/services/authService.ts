import axios from "axios";
import axiosConfig from "@/config/axiosConfig";
import { ApiResponse, UserTypes } from "@/types";
import { ENV } from "@/utils/env";

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserTypes;
}
export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${ENV.API_URL}/auth/login`,
      {
        email: email,
        password: password,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while login", error);
    throw error;
  }
};

export const signupService = async ({
  email,
  fullName,
  password,
  avatar,
}: {
  email: string;
  fullName: string;
  password: string;
  avatar?: string;
}): Promise<SignupResponse> => {
  try {
    const response = await axios.post<SignupResponse>(
      `${ENV.API_URL}/auth/register`,
      {
        email: email,
        fullName: fullName,
        password: password,
        avatar: avatar,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while signup", error);
    throw error;
  }
};

export const fetchCurrentUserService = async (): Promise<
  ApiResponse<UserTypes>
> => {
  try {
    const response =
      await axiosConfig.get<ApiResponse<UserTypes>>("/auth/currentUser");
    return response.data;
  } catch (error: any) {
    console.error("Something went wrong while fetching user data:", error);

    throw new Error(
      error?.response?.data?.message || "Failed to fetch current user"
    );
  }
};

export const updateProfileService = async ({
  fullName,
  phone,
  address,
  avatar,
}: {
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}): Promise<UpdateProfileResponse> => {
  try {
    const response = await axiosConfig.put("/auth/profile", {
      fullName: fullName,
      phone: phone,
      address: address,
      avatar: avatar,
    });
    return response.data;
  } catch (error: any) {
    console.log("Something went wront", error);
    throw error;
  }
};
