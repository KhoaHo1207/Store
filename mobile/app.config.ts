import "dotenv/config";

export default {
  expo: {
    name: "store",
    slug: "store",
    version: "1.0.0",
    userInterfaceStyle: "automatic",
    extra: {
      API_URL: process.env.API_URL,
      API_KEY: process.env.API_KEY,
    },
  },
};
