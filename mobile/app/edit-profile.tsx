import Loading from "@/components/common/Loading";
import BackButton from "@/components/ui/BackButton";
import { uploadAvatarService } from "@/services/uploadService";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { Bell, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
const EditProfileScreen = () => {
  const { user, fetchCurrentUser, updateProfile } = useAuthStore();
  const [updateUser, setUpdateUser] = useState({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (key: string, value: string) => {
    setUpdateUser((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow gallery access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      setUploading(true);

      const response = await uploadAvatarService(uri, setProgress);

      if (response.success) {
        Toast.show({ type: "success", text1: "Avatar updated successfully!" });
        return response.data;
      } else {
        Toast.show({
          type: "error",
          text1: response.message || "Upload failed",
        });
      }
    } catch (err: any) {
      console.log("Upload error:", err);
      Toast.show({ type: "error", text1: err.message || "Upload failed" });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await updateProfile({
      fullName: updateUser.fullName,
      phone: updateUser.phone,
      address: updateUser.address,
    });

    setLoading(false);
  };

  const handleUpload = async () => {
    setLoading(true);
    const res = await handlePickImage();
    console.log(res);
    await updateProfile({
      avatar: res.url,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrentUser();
    setUpdateUser(user.inform);
  }, [user.inform.avatar, fetchCurrentUser]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
          <ScrollView className="flex-1 pt-16 px-4 bg-white w-full">
            <View className="flex-row justify-between items-center">
              <BackButton />
              <Text className="text-2xl font-medium text-gray-900">
                Edit Profile
              </Text>
              <Bell size={24} />
            </View>
            <Pressable className="relative mx-auto mt-8" onPress={handleUpload}>
              <Image
                source={{ uri: updateUser.avatar }}
                className="size-32 rounded-full border-2 border-primary"
                resizeMode="contain"
              />
              <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-white">
                <Plus size={18} color={"white"} />
              </View>
            </Pressable>
            <View className="mt-8">
              <View
                className={`border rounded-xl py-2 px-4  ${
                  focusedField === "email"
                    ? "border-orange-400"
                    : "border-gray-300"
                }`}
              >
                <Text className="text-sm font-semibold mb-1">Email</Text>
                <TextInput
                  placeholder="Your Email"
                  value={updateUser.email}
                  onChangeText={(e) => handleChange("email", e)}
                  className=""
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  readOnly
                />
              </View>
              <View
                className={`border rounded-xl py-2 px-4 mt-4 ${
                  focusedField === "fullName"
                    ? "border-orange-400"
                    : "border-gray-300"
                }`}
              >
                <Text className="text-sm font-semibold mb-1">Full Name</Text>
                <TextInput
                  placeholder="Your Full Name"
                  value={updateUser.fullName}
                  onChangeText={(e) => handleChange("fullName", e)}
                  className="text-gray-500"
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <View
                className={`border rounded-xl py-2 px-4 mt-4 ${
                  focusedField === "phone"
                    ? "border-orange-400"
                    : "border-gray-300"
                }`}
              >
                <Text className="text-sm font-semibold mb-1">Phone Number</Text>
                <TextInput
                  placeholder="Your Phone Number"
                  value={updateUser.phone}
                  onChangeText={(e) => handleChange("phone", e)}
                  className="text-gray-500"
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <View
                className={`border rounded-xl py-2 px-4 mt-4 ${
                  focusedField === "address"
                    ? "border-orange-400"
                    : "border-gray-300"
                }`}
              >
                <Text className="text-sm font-semibold mb-1">Address</Text>
                <TextInput
                  placeholder="Your Address"
                  value={updateUser.address}
                  onChangeText={(e) => handleChange("address", e)}
                  className="text-gray-500"
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View className="flex-row justify-between items-center w-full mt-8 gap-5">
              <TouchableOpacity
                className="flex-1 bg-white border border-primary rounded-lg p-3"
                onPress={() => router.back()}
              >
                <Text className="text-orange-400 text-center text-lg font-semibold">
                  Discard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary rounded-lg p-3"
                onPress={handleSubmit}
              >
                <Text className="text-white  text-center text-lg font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default EditProfileScreen;
