import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/contexts/authContext";

const Home = () => {
  const { logout } = useAuth();
  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
