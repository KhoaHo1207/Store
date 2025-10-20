import React from "react";
import { Tabs } from "expo-router";
import { Home, ShoppingCart, User, Package } from "lucide-react-native";
const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF8008",
        tabBarInactiveTintColor: "#b5b5b5",
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
        name="product"
        options={{
          title: "Product",
          tabBarIcon: ({ color }) => <Package color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingCart color={color} size={22} />,
        }}
      />
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
