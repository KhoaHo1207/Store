import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useProductStore } from "@/stores/productStore";
import ProductCard from "@/components/ui/ProductCard";
import { useRouter } from "expo-router";
import SearchBar from "@/components/ui/SearchBar";

const FavoriteSCreen = () => {
  const router = useRouter();
  const { favoriteProducts, getFavoriteProducts, toggleProductFavorite } =
    useProductStore();
  const [search, setSearch] = useState<string>("");

  const handleToggleFavorite = async (id: string) => {
    await toggleProductFavorite(id);
  };
  const handleChangeSearch = (text: string) => {
    setSearch(text);
  };
  const renderEmpty = () => (
    <Text className="text-center text-gray-500 mt-10">
      Không có sản phẩm nào
    </Text>
  );

  const renderHeader = () => {
    return (
      <>
        <Text className="pt-16 px-2 text-xl font-semibold text-gray-900 mb-4">
          Favorite List
        </Text>
        <View className="mb-4">
          <SearchBar
            value={search}
            onChangeText={handleChangeSearch}
            placeholder="Search by art name"
          />
        </View>
      </>
    );
  };

  useEffect(() => {
    getFavoriteProducts();
  }, []);
  return (
    <View>
      <FlatList
        data={favoriteProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item._id}`)}
            onToggleFavorite={() => handleToggleFavorite(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: 10,
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 100,
        }}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

export default FavoriteSCreen;
