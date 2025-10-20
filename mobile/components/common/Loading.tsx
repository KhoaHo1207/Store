import { View, ActivityIndicator } from "react-native";
import React from "react";

const Loading = ({ size }: { size?: "small" | "large" }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator color={"#FF8008"} size={size} />
    </View>
  );
};

export default Loading;
