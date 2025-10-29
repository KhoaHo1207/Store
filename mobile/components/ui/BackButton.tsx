import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

const BackButton = () => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      className="bg-white shadow-sm rounded-full p-1"
    >
      <ChevronLeft size={28} color={"gray"} />
    </Pressable>
  );
};

export default BackButton;
