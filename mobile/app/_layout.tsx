import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";

const RootLayoutInner = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {token ? <Stack.Screen name="(main)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  );
};
const RootLayout = () => {
  return (
    <AuthProvider>
      <StatusBar translucent backgroundColor="transparent" style="auto" />
      <RootLayoutInner />
      <Toast />
    </AuthProvider>
  );
};

export default RootLayout;
