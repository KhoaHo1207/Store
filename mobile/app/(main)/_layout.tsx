import { Tabs } from "expo-router";
import { Heart, Home, MessageCircle, User } from "lucide-react-native";
import React from "react";
const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF8008",
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: { height: 60 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorite",
          tabBarIcon: ({ color }) => <Heart color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat AI",
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={22} />,
        }}
      />
      {/* <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingCart color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Order",
          tabBarIcon: ({ color }) => <Package color={color} size={22} />,
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
