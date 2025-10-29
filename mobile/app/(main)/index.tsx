import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/ui/SearchBar";
import ProductCard from "@/components/ui/ProductCard";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import Loading from "@/components/common/Loading";
import { LayoutGrid } from "lucide-react-native";
import { debounce } from "lodash";
import { useRouter } from "expo-router";
const ProductList = () => {
  const router = useRouter();
  const { user, fetchCurrentUser, logout } = useAuthStore();
  const {
    products,
    brands,
    fetchProducts,
    fetchBrands,
    toggleProductFavorite,
    loadMoreProducts,
    loading,
    loadingMore,
  } = useProductStore();

  const [search, setSearch] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      fetchProducts({
        limit: 100,
        search: text,
        brand: selectedBrand,
      });
    }, 500),
    [selectedBrand, fetchProducts]
  );

  const handleChangeSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const handleSelectBrand = (brand: string) => {
    const newBrand = brand === selectedBrand ? "" : brand;
    setSelectedBrand(newBrand);
    fetchProducts({
      limit: 100,
      search,
      brand: newBrand,
    });
  };

  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchCurrentUser();
    fetchBrands();
  }, [fetchProducts, fetchCurrentUser, fetchBrands]);

  const renderFooter = () =>
    loadingMore ? (
      <View className="py-4">
        <Loading size="small" />
      </View>
    ) : null;

  const renderHeader = () => (
    <View className="pb-4">
      <Text className="text-xl font-semibold text-gray-900">Brand</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => handleSelectBrand("")}
            className={`flex-row items-center py-2 px-4 rounded-md border ${
              selectedBrand === ""
                ? "bg-primary border-primary"
                : "border-gray-300"
            }`}
          >
            <LayoutGrid
              size={18}
              color={selectedBrand === "" ? "white" : "black"}
            />
            <Text
              className={`ml-2 ${
                selectedBrand === "" ? "text-white" : "text-gray-900"
              }`}
            >
              Tất cả
            </Text>
          </Pressable>

          {brands.map((brand: string, index: number) => {
            const isActive = brand === selectedBrand;
            return (
              <Pressable
                key={index}
                onPress={() => handleSelectBrand(brand)}
                className={`py-2 px-4 rounded-md border ${
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text className={isActive ? "text-white" : "text-gray-900"}>
                  {brand}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Text className="text-xl font-semibold text-gray-900 mt-4">Art</Text>
    </View>
  );

  const renderEmpty = () => (
    <Text className="text-center text-gray-500 mt-10">
      Không có sản phẩm nào
    </Text>
  );

  const handleToggleFavorite = (id: string) => {
    toggleProductFavorite(id);
  };
  if (loading) {
    return (
      <ScreenWrapper>
        <Loading size="large" />
      </ScreenWrapper>
    );
  }

  return (
    <View className="pt-16 px-2">
      <Header user={user?.inform} notificationsCount={10} />

      <View className="my-3">
        <SearchBar
          value={search}
          onChangeText={handleChangeSearch}
          placeholder="Search by art name"
        />
      </View>

      <FlatList
        data={products}
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
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 100,
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => loadMoreProducts()}
      />
    </View>
  );
};

export default ProductList;
