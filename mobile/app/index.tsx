import { useAuthStore } from "@/stores/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

const SplashScreen = () => {
  const router = useRouter();
  const { checkToken, fetchCurrentUser } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    const init = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const tokenFromStore = await checkToken();
      if (tokenFromStore) fetchCurrentUser();
      if (tokenFromStore) router.replace("/(main)");
      else router.replace("/(auth)/login");
    };
    init();
  }, [checkToken, router]);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#FF8008", "#FFC837"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 items-center justify-center"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="h-full w-full items-center justify-center"
        >
          <View className="w-48 h-48 items-center justify-center">
            <Image
              source={require("@/assets/images/shop.png")}
              resizeMode="contain"
              className="w-full h-full"
            />
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default SplashScreen;
