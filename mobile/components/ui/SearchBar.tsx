import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "",
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl p-3 border border-gray-200">
      <Search size={20} color="#6B7280" strokeWidth={1} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-2 text-base text-gray-800"
        autoCapitalize="none"
        returnKeyType="search"
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          className="ml-2 p-1 rounded-full bg-gray-100"
        >
          <X size={16} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
