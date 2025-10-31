import "@/global.css";
import { useAuthStore } from "@/stores/authStore";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar translucent backgroundColor="transparent" style="dark" />
          <RootLayoutInner />
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default RootLayout;
