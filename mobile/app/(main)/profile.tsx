import Loading from "@/components/common/Loading";
import ProfileItem from "@/components/ui/ProfileItem";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import { Edit, Heart, LogOut, Map, MessageCircle } from "lucide-react-native";
import React, { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  const { user, fetchCurrentUser, logout } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (!user) {
    return <Loading size="small" />;
  }

  const Items = [
    {
      title: "Favorite",
      icon: <Heart />,
      onPress: () => router.push("/(main)/favorite"),
    },
    {
      title: "Chat AI",
      icon: <MessageCircle />,
      onPress: () => router.push("/(main)/chat"),
    },
    // {
    //   title: "Order",
    //   icon: <Package />,
    //   onPress: () => router.push("/(main)/order"),
    // },
    // {
    //   title: "Cart",
    //   icon: <ShoppingCart />,
    //   onPress: () => router.push("/(main)/cart"),
    // },
    {
      title: "Current Location",
      icon: <Map />,
      onPress: () => router.push("/map"),
    },
    {
      title: "Log Out",
      icon: <LogOut color="#FF2E2E" />,
      color: "#FF2E2E",
      onPress: () => logout(),
    },
  ];
  return (
    <ScrollView className="flex-1 bg-white">
      <View
        className={`flex-1 justify-start items-center bg-primary pt-16 pb-8 rounded-b-[40px]`}
      >
        <Text className="text-2xl font-semibold text-white">Profile</Text>
        <TouchableOpacity
          className="relative"
          onPress={() => router.push("/edit-profile")}
        >
          <Image
            source={
              user.inform.avatar ? { uri: user.inform.avatar } : undefined
            }
            className="w-32 h-32 rounded-full mt-8"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 right-2 bg-white p-2 rounded-full">
            <Edit color={"#FF8008"} size={20} />
          </View>
        </TouchableOpacity>
        <Text className="text-3xl font-semibold mt-4 text-white">
          {user.inform.fullName}
        </Text>
        <Text className="text-base font-medium text-white">
          {user.inform.email}
        </Text>
      </View>
      <View className="flex mt-8 gap-6 mx-4">
        {Items.map((item, index) => (
          <ProfileItem key={index} {...item} />
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
