import Constants from "expo-constants";

const { API_URL, API_KEY } = Constants.expoConfig?.extra || {};

export const ENV = {
  API_URL: API_URL as string,
  API_KEY: API_KEY as string,
};
