import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";

interface ProductCardProps {
  product: {
    _id: string;
    artName: string;
    price: number;
    description?: string;
    image: string;
    brand?: string;
    limitedTimeDeal?: number;
  };
  onPress?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const ProductCard = ({
  product,
  onPress,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) => {
  const discount = product.limitedTimeDeal
    ? Math.round(product.limitedTimeDeal * 100)
    : 0;
  const finalPrice = product.price * (1 - (product.limitedTimeDeal || 0));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-2xl shadow-sm mb-4 flex-1"
      style={{ minWidth: "48%" }}
    >
      {/* --- Hình sản phẩm --- */}
      <View className="relative">
        <Image
          source={{
            uri: product.image || "https://via.placeholder.com/150",
          }}
          className="w-full h-44 rounded-t-2xl"
          resizeMode="cover"
        />

        {/* --- Icon yêu thích --- */}
        <TouchableOpacity
          onPress={onToggleFavorite}
          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-xl"
        >
          <Heart
            size={18}
            color={isFavorite ? "#ef4444" : "#6b7280"}
            fill={isFavorite ? "#ef4444" : "transparent"}
          />
        </TouchableOpacity>

        {/* --- Nhãn giảm giá --- */}
        {discount > 0 && (
          <View className="absolute bottom-2 left-2 bg-red-500 px-2 py-0.5 rounded-md">
            <Text className="text-white text-xs font-semibold">
              -{discount}%
            </Text>
          </View>
        )}
      </View>

      {/* --- Nội dung sản phẩm --- */}
      <View className="p-3">
        {/* Brand */}
        {product.brand && (
          <Text className="text-gray-400 text-xs mb-1">{product.brand}</Text>
        )}

        {/* Tên sản phẩm */}
        <Text
          numberOfLines={2}
          className="text-sm font-semibold text-gray-800 leading-5"
        >
          {product.artName}
        </Text>

        {/* Giá và giá gốc */}
        <View className="mt-2 flex-row items-center">
          <Text className="text-[#5086C4] font-bold text-base mr-2">
            {finalPrice.toLocaleString("vi-VN")}₫
          </Text>
          {discount > 0 && (
            <Text className="text-gray-400 line-through text-xs">
              {product.price.toLocaleString("vi-VN")}₫
            </Text>
          )}
        </View>

        {/* Nút thêm giỏ hàng */}
        <TouchableOpacity
          onPress={() => console.log("Add to cart:", product.artName)}
          activeOpacity={0.8}
          className="mt-3 bg-[#5086C4] py-2 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-sm">
            Thêm vào giỏ
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
