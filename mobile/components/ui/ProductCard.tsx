import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Heart, Star } from "lucide-react-native";

interface ProductCardProps {
  product: {
    _id: string;
    artName: string;
    price: number;
    description?: string;
    image: string;
    brand?: string;
    limitedTimeDeal?: number;
    isFavorite?: boolean;
    averageRating?: number;
    totalRating?: number;
  };
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

const ProductCard = ({
  product,
  onPress,
  onToggleFavorite,
}: ProductCardProps) => {
  const discount = product.limitedTimeDeal
    ? Math.round(product.limitedTimeDeal * 100)
    : 0;
  const finalPrice = (
    product.price *
    (1 - (product.limitedTimeDeal || 0))
  ).toFixed(2);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-2xl shadow-sm mb-4 flex-1"
      style={{ minWidth: "48%" }}
    >
      <View className="relative">
        <Image
          source={{
            uri: product.image || "https://via.placeholder.com/150",
          }}
          className="w-full h-44 rounded-t-2xl"
          resizeMode="contain"
        />

        <TouchableOpacity
          onPress={onToggleFavorite}
          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-xl"
        >
          <Heart
            size={18}
            color={product.isFavorite ? "#ef4444" : "#6b7280"}
            fill={product.isFavorite ? "#ef4444" : "transparent"}
          />
        </TouchableOpacity>

        {discount > 0 && (
          <View className="absolute bottom-2 left-2 bg-red-500 px-2 py-0.5 rounded-md">
            <Text className="text-white text-xs font-semibold">
              -{discount}%
            </Text>
          </View>
        )}
      </View>

      <View className="p-3">
        {product.brand && (
          <Text className="text-gray-400 text-xs mb-1">{product.brand}</Text>
        )}

        <Text
          numberOfLines={2}
          className="text-sm font-semibold text-gray-800 leading-5"
        >
          {product.artName}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Text className="text-[#e42020] font-bold text-base mr-2">
            ${finalPrice}
          </Text>
          {discount > 0 && (
            <Text className="text-gray-400 line-through text-xs">
              ${product.price}
            </Text>
          )}
        </View>

        <View className="mt-1 flex-row items-center">
          <Star size={14} color="#facc15" fill="#facc15" />
          <Text className="text-gray-800 text-xs ml-1">
            {product.averageRating?.toFixed(1) || "0.0"}
          </Text>
          <Text className="text-gray-400 text-xs ml-1">
            ({product.totalRating || 0})
          </Text>
        </View>
        {/* <TouchableOpacity
          onPress={() => console.log("Add to cart:", product.artName)}
          activeOpacity={0.8}
          className="mt-3 bg-orange-400 py-2 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-sm">
            Thêm vào giỏ
          </Text>
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
