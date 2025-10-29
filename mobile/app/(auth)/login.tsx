import FormInput from "@/components/common/FormInput";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import Button from "@/components/common/Button";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const LoginScreen = () => {
  const inset = useSafeAreaInsets();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleChangeEmail = (e: any) => {
    setEmail(e);
  };

  const hanldeChangePassword = (e: any) => {
    setPassword(e);
  };
  const hanldleLogin = async () => {
    if (!email || !password)
      return Alert.alert("Warning", "Please fill all the fields!");
    const res = await login(email, password);
    if (res) {
      router.replace("/(main)");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: inset.top + 15 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="bg-white"
      >
        <View className="w-32 h-32 bg-orange-400 rounded-full shadow-2xl flex items-center justify-center mx-auto">
          <Image
            source={require("@/assets/images/shop.png")}
            resizeMode="contain"
            className="w-24 h-24"
          />
        </View>

        <View className="mt-8 px-5">
          <Text className="text-3xl font-bold text-gray-800 text-center">
            Welcome Back
          </Text>
          <Text className="text-gray-500 text-center mt-2 text-sm leading-5">
            Explore and shop our amazing products!
          </Text>

          <View className="flex justify-center items-center gap-4 my-8">
            <FormInput
              icon={<Mail color={"gray"} size={20} />}
              type="email"
              value={email}
              onChangeText={handleChangeEmail}
              placeholder={"abcxyz@gmail.com"}
              className="flex-1"
            />
            <FormInput
              icon={<Lock color={"gray"} size={20} />}
              type="password"
              value={password}
              onChangeText={hanldeChangePassword}
              placeholder={"*********"}
              className="flex-1"
            />
          </View>

          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center space-x-2"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View className="w-5 h-5 rounded-md border border-gray-400 items-center justify-center mr-2">
                <Checkbox
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  color={rememberMe ? "#FF8008" : undefined}
                  style={{ width: 18, height: 18, borderRadius: 6 }}
                />
              </View>
              <Text className="text-gray-700">Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="underline text-red-600">Forgot Password</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={loading ? "Loading..." : "Login"}
            className={loading ? "my-4 bg-orange-400/90" : "my-4 bg-orange-400"}
            onPress={hanldleLogin}
            disabled={loading}
          />

          <View className="items-center my-4">
            <View className="flex-row items-center ">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-3 text-gray-500">Or sign with</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg mt-4"
            >
              <Image
                source={require("@/assets/images/google.png")}
                className="w-6 h-6 rounded-full"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center mx-auto">
            <Text> You don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-primary underline self-center">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
