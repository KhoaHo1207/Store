import "@/global.css";
import { useAuthStore } from "@/stores/authStore";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

const RootLayoutInner = () => {
  const { loading } = useAuthStore();

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Slot />
    </Stack>
  );
};
const RootLayout = () => {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" style="dark" />
      <RootLayoutInner />
      <Toast />
    </>
  );
};

export default RootLayout;
