import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
interface FormInputsProps {
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}
const FormInput = ({
  icon,
  value,
  type = "text",
  onChangeText,
  placeholder,
  className,
}: FormInputsProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  useState<boolean>(false);
  return (
    <View
      className={`flex-row items-center border border-gray-300 rounded-lg bg-gray-50 px-4 h-12 ${
        className || ""
      }`}
    >
      {/* Icon trái */}
      {icon && <View className="mr-3">{icon}</View>}

      {/* TextInput chiếm hết khoảng trống */}
      <TextInput
        className="flex-1 text-base" // text-base ~16px
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={type === "email" ? "email-address" : "default"}
        secureTextEntry={type === "password" && !showPassword}
      />

      {/* Eye icon sát phải */}
      {type === "password" && (
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          className="ml-2"
        >
          {showPassword ? (
            <Eye color="gray" size={20} />
          ) : (
            <EyeOff color="gray" size={20} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FormInput;
