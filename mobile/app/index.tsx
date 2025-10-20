import React, { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();
  const { checkToken } = useAuthStore();
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

      if (tokenFromStore) router.replace("/(main)");
      else router.replace("/(auth)/login");
    };
    init();
  }, []);

  return (
    <View className="flex-1">
      {/* Nền gradient toàn màn */}
      <LinearGradient
        colors={["#FF8008", "#FFC837"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 items-center justify-center"
      >
        {/* Logo được animate */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center justify-center"
        >
          <View className="w-48 h-48 items-center justify-center">
            <Image
              source={require("@/assets/images/shop.png")}
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default SplashScreen;
