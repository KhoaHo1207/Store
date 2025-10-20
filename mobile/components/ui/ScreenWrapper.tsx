import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className="flex-1 px-2">{children}</SafeAreaView>;
};

export default ScreenWrapper;
