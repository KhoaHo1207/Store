import React, { useRef } from "react";
import { View, Text, Image, Pressable, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Trash2, Star } from "lucide-react-native";

interface ProductCardHorizontalProps {
  product: any;
  isSelectMode?: boolean;
  checked?: boolean;
  onToggleSelect?: () => void;
  onPress?: () => void;
  onDelete?: () => void;
  onSwipeableOpen?: (ref: any) => void;
}

const ProductCardHorizontal = ({
  product,
  isSelectMode,
  checked,
  onToggleSelect,
  onPress,
  onDelete,
  onSwipeableOpen,
}: ProductCardHorizontalProps) => {
  const swipeRef = useRef<any>(null);

  const discount = product.limitedTimeDeal
    ? Math.round(product.limitedTimeDeal * 100)
    : 0;

  const finalPrice = (
    product.price *
    (1 - (product.limitedTimeDeal || 0))
  ).toFixed(2);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-75, 0],
      outputRange: [0, 75],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          transform: [{ translateX: trans }],
          width: 75,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onDelete}
          className="bg-red-500 w-[70px] h-[85%] rounded-lg justify-center items-center"
        >
          <Trash2 size={22} color="white" />
          <Text className="text-white text-xs mt-1">Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => onSwipeableOpen?.(swipeRef.current)}
      rightThreshold={40}
      overshootRight={false}
      enabled={!isSelectMode}
      containerStyle={{
        marginBottom: 12,
        borderRadius: 12,
      }}
    >
      <Pressable
        onPress={() => {
          if (isSelectMode) onToggleSelect?.();
          else onPress?.();
        }}
        className={`flex-row bg-white rounded-2xl p-3 shadow-sm border ${
          checked ? "border-primary" : "border-gray-100"
        }`}
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <Image
          source={{ uri: product.image }}
          className="w-24 h-24 rounded-xl"
          resizeMode="contain"
        />

        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text className="text-gray-400 text-xs">{product.brand}</Text>
            <Text
              numberOfLines={2}
              className="text-gray-900 font-semibold text-base leading-tight mt-1"
            >
              {product.artName}
            </Text>

            <View className="flex-row items-center mt-1.5">
              <Star size={14} color="#facc15" fill="#facc15" />
              <Text className="ml-1 text-gray-800 text-sm font-medium">
                {Number(product.averageRating || 0).toFixed(1)}
              </Text>
              <Text className="ml-1 text-xs text-gray-500">
                ({product.totalRating || 0})
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-2">
            <Text className="text-primary font-bold text-lg">
              ${finalPrice}
            </Text>
            {discount > 0 && (
              <Text className="text-gray-400 text-xs line-through ml-2">
                ${product.price.toFixed(2)}
              </Text>
            )}
          </View>
        </View>

        {isSelectMode && (
          <View
            className={`w-5 h-5 rounded-full border-2 ml-2 ${
              checked ? "border-primary bg-primary" : "border-gray-400"
            }`}
          />
        )}
      </Pressable>
    </Swipeable>
  );
};

export default ProductCardHorizontal;
