import React from "react";
import { TouchableOpacity, Text, ViewStyle } from "react-native";

interface ButtonProps {
  title?: string;
  disabled: boolean;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
}

const Button = ({
  title,
  disabled,
  onPress,
  className,
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`rounded-xl py-4 px-6 shadow-md ${className || ""}`}
      style={style}
      disabled={disabled}
    >
      <Text className="text-white text-center font-semibold text-lg">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
