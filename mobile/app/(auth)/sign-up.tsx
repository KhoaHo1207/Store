import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import { useAuth } from "@/contexts/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Lock, Mail, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const SignUpScreen = () => {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleChangeEmail = (e: any) => {
    setEmail(e);
  };

  const handdleChangeUsername = (e: any) => {
    setUsername(e);
  };
  const hanldeChangePassword = (e: any) => {
    setPassword(e);
  };

  const handleChangeConfirmPassword = (e: any) => {
    setConfirmPassword(e);
  };

  const handleSignUp = async () => {
    if (!email || !password || !username || !confirmPassword)
      return Alert.alert("Warning", "Please fill all the fields!");
    await signup({ email, username, password });
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="relative">
        <LinearGradient
          colors={["#FF8008", "#FFC837"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-52 w-full items-center justify-center rounded-b-3xl"
        />

        <View className="absolute left-0 right-0 -bottom-16 items-center">
          <View className="w-32 h-32 bg-white rounded-full shadow-2xl items-center justify-center">
            <Image
              source={require("@/assets/images/shop.png")}
              resizeMode="contain"
              className="w-24 h-24"
            />
          </View>
        </View>
      </View>

      <View className="mt-24 px-5">
        <Text className="text-3xl font-bold text-gray-800 text-center">
          Register Account
        </Text>
        <Text className="text-gray-500 text-center mt-2 text-sm leading-5">
          Create an account and start shopping
        </Text>

        <View className="flex justify-center items-center gap-4 my-8">
          <FormInput
            icon={<Mail color={"gray"} size={20} />}
            type="email"
            value={email}
            onChangeText={handleChangeEmail}
            placeholder={"Email"}
            className="flex-1"
          />
          <FormInput
            icon={<User color={"gray"} size={20} />}
            type="text"
            value={username}
            onChangeText={handdleChangeUsername}
            placeholder={"Username"}
            className="flex-1"
          />
          <FormInput
            icon={<Lock color={"gray"} size={20} />}
            type="password"
            value={password}
            onChangeText={hanldeChangePassword}
            placeholder={"Password"}
            className="flex-1"
          />
          <FormInput
            icon={<Lock color={"gray"} size={20} />}
            type="password"
            value={confirmPassword}
            onChangeText={handleChangeConfirmPassword}
            placeholder={"Confirm Password"}
            className="flex-1"
          />
        </View>

        <Button
          title={loading ? "Loading..." : "Signup"}
          className={loading ? "mb-4 bg-orange-400/90" : "mb-4 bg-orange-400"}
          onPress={handleSignUp}
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
          <Text> You already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-primary underline self-center">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
