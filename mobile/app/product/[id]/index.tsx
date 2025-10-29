import Loading from "@/components/common/Loading";
import { useProductStore } from "@/stores/productStore";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    fetchProductById,
    toggleProductFavorite,
    favoriteProducts,
    reviews,
    fetchReviews,
  } = useProductStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await fetchProductById(id);
      if (res) {
        const isFavorite = favoriteProducts.some(
          (item) => item._id === res._id
        );
        setProduct({ ...res, isFavorite });
      }
      setLoading(false);
    };
    fetchReviews(id);
    fetch();
  }, [id, favoriteProducts]);

  const handleAddFavorite = async (id: string) => {
    if (!product?._id) return;

    setProduct((prev) => ({
      ...prev,
      isFavorite: !prev?.isFavorite,
    }));

    await toggleProductFavorite(id);
  };

  if (loading || !product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Loading size="large" />
      </View>
    );
  }

  const discountPrice =
    product.limitedTimeDeal && product.limitedTimeDeal > 0
      ? (product.price * (1 - product.limitedTimeDeal)).toFixed(2)
      : null;

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="relative">
          <Image
            source={{ uri: product.image }}
            className="w-full h-[30rem]"
            resizeMode="contain"
          />

          <View className="absolute top-0 left-0 right-0 px-4 pt-14 flex-row justify-between items-center z-10">
            <Pressable
              onPress={() => router.back()}
              className="p-2 bg-gray-200/70 rounded-full"
            >
              <ArrowLeft size={22} color="black" />
            </Pressable>

            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => handleAddFavorite(id)}
                className="p-2 bg-gray-200/70 rounded-full"
              >
                <Heart
                  size={22}
                  color={product.isFavorite ? "#ef4444" : "black"}
                  fill={product.isFavorite ? "#ef4444" : "transparent"}
                />
              </Pressable>

              {/* <Pressable
                onPress={() => router.push("/cart")}
                className="p-2 bg-gray-200/70 rounded-full"
              >
                <ShoppingCart size={22} color="black" />
              </Pressable> */}
            </View>
          </View>
        </View>

        <View className="px-4 mt-4">
          <Text className="text-2xl font-semibold text-gray-900">
            {product.artName}
          </Text>
          <Text className="mt-1 tetx-gray-600">{product.brand}</Text>
          <View className="flex-row items-center mt-2">
            {discountPrice ? (
              <>
                <Text className="text-xl font-bold text-primary mr-2">
                  ${discountPrice}
                </Text>
                <Text className="text-base text-gray-400 line-through">
                  ${product.price}
                </Text>
              </>
            ) : (
              <Text className="text-xl font-bold text-primary">
                ${product.price}
              </Text>
            )}
          </View>

          {product.limitedTimeDeal > 0 && (
            <Text className="text-sm text-orange-500 mt-1">
              🔥 Giảm {(product.limitedTimeDeal * 100).toFixed(0)}%
            </Text>
          )}

          <Text className="text-base text-gray-700 mt-4 leading-6">
            {product.description}
          </Text>

          {product.createdBy && (
            <View className="flex-row items-center mt-6 border-y-[1px] border-gray-200 p-4">
              <Image
                source={{ uri: product.createdBy.avatar }}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-3">
                <Text className="text-base font-semibold text-gray-900">
                  {product.createdBy.fullName}
                </Text>
                <Text className="text-sm text-gray-500">
                  📞 {product.createdBy.phone}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="px-4 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Star size={18} color="#facc15" fill="#facc15" />
              <Text className="text-lg font-semibold text-gray-900 ml-1">
                {product.averageRating?.toFixed(1) || "0.0"}
              </Text>
              <Text className="text-gray-500 ml-1 text-sm">
                / 5 ({product.totalRating || 0} ratings)
              </Text>
            </View>

            <Pressable onPress={() => router.push(`/product/${id}/review`)}>
              <Text className="text-primary text-sm font-semibold">
                View all
              </Text>
            </Pressable>
          </View>

          {reviews?.length > 0 ? (
            reviews.slice(0, 2).map((item, index) => (
              <View
                key={index}
                className="border-b border-gray-200 pb-4 mb-4 flex-row gap-3"
              >
                <Image
                  source={{
                    uri:
                      item.userId?.avatar || "https://via.placeholder.com/50",
                  }}
                  className="w-10 h-10 rounded-full"
                />

                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">
                    {item.userId?.fullName || "Người dùng ẩn danh"}
                  </Text>

                  <View className="flex-row items-center my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        color={i < item.rating ? "#facc15" : "#d1d5db"}
                        fill={i < item.rating ? "#facc15" : "transparent"}
                      />
                    ))}
                  </View>

                  <Text className="text-gray-700 text-sm leading-5">
                    {item.comment}
                  </Text>

                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      className="w-24 h-24 mt-2 rounded-lg"
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-sm text-center">
              Chưa có đánh giá nào cho sản phẩm này.
            </Text>
          )}
        </View>
      </ScrollView>
      {/* 
      <View className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t border-gray-200 p-4 pb-8">
        <Pressable
          onPress={handleAddToCart}
          className="flex-1 bg-gray-100 py-3 rounded-xl mr-3"
        >
          <Text className="text-center font-semibold text-gray-800">
            Thêm vào giỏ
          </Text>
        </Pressable>

        <Pressable
          onPress={handleBuyNow}
          className="flex-1 bg-primary py-3 rounded-xl"
        >
          <Text className="text-center font-semibold text-white">Mua ngay</Text>
        </Pressable>
      </View> */}
    </View>
  );
};

export default ProductDetail;
