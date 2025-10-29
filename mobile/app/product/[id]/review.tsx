import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Star } from "lucide-react-native";
import { useProductStore } from "@/stores/productStore";
import Loading from "@/components/common/Loading";

const ReviewScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchReviews, reviews, averageRating, totalRating } =
    useProductStore();

  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchReviews(id);
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!reviews) return;
    if (selectedFilter === null) setFilteredReviews(reviews);
    else
      setFilteredReviews(
        reviews.filter((r) => Math.round(r.rating) === selectedFilter)
      );
  }, [selectedFilter, reviews]);

  // 🔢 Tính số lượng review theo sao
  const starStats = useMemo(() => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews?.forEach((r) => {
      const rate = Math.round(r.rating);
      if (rate >= 1 && rate <= 5) stats[rate]++;
    });
    return stats;
  }, [reviews]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Loading size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4 border-b border-gray-200">
        <Pressable
          onPress={() => router.back()}
          className="p-2 bg-gray-200/70 rounded-full"
        >
          <ArrowLeft size={22} color="black" />
        </Pressable>
        <Text className="text-2xl font-medium text-gray-900">Ratings</Text>
        <View className="w-6" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="items-center mt-6 mb-4 px-4">
          <Text className="text-4xl font-bold text-yellow-500">
            {averageRating?.toFixed(1) ?? "0.0"}
          </Text>
          <View className="flex-row items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                color={
                  i < Math.round(averageRating ?? 0) ? "#facc15" : "#d1d5db"
                }
                fill={
                  i < Math.round(averageRating ?? 0) ? "#facc15" : "transparent"
                }
              />
            ))}
          </View>
          <Text className="text-gray-500 text-sm mt-1">
            {totalRating || 0} ratings
          </Text>

          <View className="w-full mt-6">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starStats[star];
              const percent =
                totalRating && totalRating > 0
                  ? Math.round((count / totalRating) * 100)
                  : 0;
              return (
                <View
                  key={star}
                  className="flex-row items-center justify-between mb-2"
                >
                  <View className="flex-row items-center w-12">
                    <Text className="text-sm text-gray-700 mr-1">{star}</Text>
                    <Star size={12} color="#facc15" fill="#facc15" />
                  </View>

                  <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2 overflow-hidden">
                    <View
                      style={{ width: `${percent}%` }}
                      className="h-2 bg-yellow-400 rounded-full"
                    />
                  </View>

                  <View className="w-16 flex-row justify-end">
                    <Text className="text-xs text-gray-600">
                      {percent}% ({count})
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mb-6"
        >
          {[
            { label: "All", value: null },
            { label: "5 star", value: 5 },
            { label: "4 star", value: 4 },
            { label: "3 star", value: 3 },
            { label: "2 star", value: 2 },
            { label: "1 star", value: 1 },
          ].map((item, idx) => (
            <Pressable
              key={idx}
              onPress={() => setSelectedFilter(item.value)}
              className={`px-3.5 py-1.5 rounded-lg mr-2 border ${
                selectedFilter === item.value
                  ? "bg-primary border-primary"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <Text
                className={`text-base ${
                  selectedFilter === item.value
                    ? "text-white font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="px-4">
          {filteredReviews?.length > 0 ? (
            filteredReviews.map((review, index) => (
              <View
                key={index}
                className="border-b border-gray-200 pb-4 mb-4 flex-row gap-3"
              >
                <Image
                  source={{
                    uri:
                      review.userId?.avatar || "https://via.placeholder.com/50",
                  }}
                  className="w-10 h-10 rounded-full"
                />

                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">
                    {typeof review.userId?.fullName === "string"
                      ? review.userId.fullName
                      : "Người dùng ẩn danh"}
                  </Text>

                  <View className="flex-row items-center my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        color={i < review.rating ? "#facc15" : "#d1d5db"}
                        fill={i < review.rating ? "#facc15" : "transparent"}
                      />
                    ))}
                  </View>

                  <Text className="text-gray-700 text-sm leading-5 mb-1">
                    {typeof review.comment === "string" ? review.comment : ""}
                  </Text>

                  {typeof review.image === "string" &&
                    review.image.trim().length > 0 && (
                      <Image
                        source={{ uri: review.image }}
                        className="w-24 h-24 mt-2 rounded-lg"
                        resizeMode="cover"
                      />
                    )}

                  <Text className="text-gray-400 text-xs mt-2">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center mt-8">
              Chưa có đánh giá nào
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReviewScreen;
