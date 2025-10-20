import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";
import { getGreeting } from "@/utils/features";

interface HeaderProps {
  user?: {
    fullName?: string;
    avatar?: string;
  };
  notificationsCount?: number;
}

const Header = ({ user, notificationsCount = 0 }: HeaderProps) => {
  return (
    <View className="flex-row justify-between items-center pr-1">
      <View className="flex-row items-center space-x-3">
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          className="w-12 h-12 rounded-full border border-gray-200 mr-2"
          resizeMode="cover"
        />
        <View>
          <Text className="text-gray-500 text-sm">{getGreeting()}</Text>
          <Text className="text-lg font-medium text-gray-900">
            {user?.fullName || "Guest"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        className="relative bg-white rounded-full p-2 shadow-sm"
      >
        <Bell size={22} color="#333" />

        {/* Badge thông báo */}
        {notificationsCount > 0 && (
          <View className="absolute -top-1.5 -right-1.5 bg-primary w-5 h-5 rounded-full items-center justify-center">
            <Text className="text-white text-[10px] font-semibold">
              {notificationsCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;
