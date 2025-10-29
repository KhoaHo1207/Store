import { ENV } from "@/utils/env";
import axios from "axios";

export const uploadAvatarService = async (
  uri: string,
  onUploadProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  try {
    const res = await axios.post(`${ENV.API_URL}/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          onUploadProgress(progress);
        }
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Upload avatar failed:", error);
    throw error.response?.data || { message: "Failed to upload avatar" };
  }
};
