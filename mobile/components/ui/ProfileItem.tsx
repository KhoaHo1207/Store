import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronRight } from "lucide-react-native";

interface Props {
  icon: React.ReactNode;
  title: string;
  color?: string;
  onPress: () => void;
}
const ProfileItem = (item: Props) => {
  return (
    <TouchableOpacity
      className={`flex flex-row justify-between items-center gap-2 border-[1px] border-gray-200 p-4 rounded-xl`}
      onPress={item.onPress}
    >
      <View className={`flex-row gap-3`}>
        {item.icon}
        <Text className={`text-xl ${item.color ? `text-[#FF2E2E]` : ""}`}>
          {item.title}
        </Text>
      </View>
      <ChevronRight color={"gray"} />
    </TouchableOpacity>
  );
};

export default ProfileItem;
