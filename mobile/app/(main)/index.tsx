import Loading from "@/components/common/Loading";
import Header from "@/components/layout/Header";
import ProductCard from "@/components/ui/ProductCard";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import SearchBar from "@/components/ui/SearchBar";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import React, { useEffect } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

const ProductList = () => {
  const {
    products,
    fetchProducts,
    loadMoreProducts,
    loading,
    loadingMore,
    hasMore,
  } = useProductStore();

  const { user, fetchCurrentUser } = useAuthStore();

  const [search, setSearch] = React.useState<string>("");

  const handleChangeSearch = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    fetchProducts();
    fetchCurrentUser();
  }, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <Loading size={"small"} />
      </View>
    );
  };

  return (
    <ScreenWrapper>
      {loading ? (
        <Loading size={"large"} />
      ) : (
        <View>
          <Header user={user} notificationsCount={10} />

          <View className="my-3">
            <SearchBar
              value={search}
              onChangeText={handleChangeSearch}
              placeholder="Search by art name"
            />
          </View>

          <View>
            {/* <Text className="text-2xl font-semibold text-gray-900 mb-3">
              New Arrivals
            </Text> */}
            <Text className="text-2xl font-semibold text-gray-900">Brand</Text>
          </View>
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              gap: 10,
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onEndReachedThreshold={0.3}
            onEndReached={() => loadMoreProducts()}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-10">
                Không có sản phẩm nào
              </Text>
            }
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default ProductList;
