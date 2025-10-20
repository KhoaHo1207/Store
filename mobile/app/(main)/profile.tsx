import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import { User, Mail, Shield } from "lucide-react-native";
import Loading from "@/components/common/Loading";

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user) {
    return <Loading />;
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="items-center mt-10">
        <View className="relative">
          <Image
            source={{ uri: user.avatar }}
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
          <View className="absolute bottom-1 right-1 bg-blue-500 p-1.5 rounded-full">
            <User size={16} color="white" />
          </View>
        </View>
        <Text className="mt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
          {user.fullName}
        </Text>
        <Text className="text-gray-500 text-sm">{user.email}</Text>
      </View>

      {/* Info Card */}
      <View className="mt-8 mx-5 bg-gray-100 dark:bg-neutral-800 p-5 rounded-2xl shadow-sm">
        <View className="flex-row items-center mb-4">
          <User size={20} color="#3b82f6" />
          <Text className="ml-3 text-base text-gray-700 dark:text-gray-200">
            {user.fullName}
          </Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Mail size={20} color="#3b82f6" />
          <Text className="ml-3 text-base text-gray-700 dark:text-gray-200">
            {user.email}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Shield size={20} color="#3b82f6" />
          <Text className="ml-3 text-base capitalize text-gray-700 dark:text-gray-200">
            {user.role}
          </Text>
        </View>
      </View>

      {/* Created date */}
      <View className="mt-4 mx-5">
        <Text className="text-sm text-gray-400">
          Tạo ngày: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
        </Text>
      </View>

      {/* Update button */}
      <View className="mt-10 mx-5">
        <TouchableOpacity
          onPress={() => router.push("/update-profile")}
          activeOpacity={0.8}
          className="bg-blue-500 py-4 rounded-2xl shadow-md"
        >
          <Text className="text-center text-white font-semibold text-base">
            Cập nhật hồ sơ
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
