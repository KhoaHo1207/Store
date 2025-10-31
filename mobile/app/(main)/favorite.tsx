import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { ArrowLeft, Trash2, LayoutGrid } from "lucide-react-native";
import { useProductStore } from "@/stores/productStore";
import SearchBar from "@/components/ui/SearchBar";
import ProductCardHorizontal from "@/components/ui/ProductCardHorizontal";

const FavoriteScreen = () => {
  const router = useRouter();
  const { favoriteProducts, getFavoriteProducts, toggleProductFavorite } =
    useProductStore();

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const openRowRef = useRef<any>(null);

  useEffect(() => {
    getFavoriteProducts();
  }, []);

  const debouncedSearch = useCallback(
    debounce((t: string) => setSearch(t), 350),
    []
  );

  const brands = useMemo(
    () => [...new Set(favoriteProducts.map((p) => p.brand).filter(Boolean))],
    [favoriteProducts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return favoriteProducts.filter((p) => {
      const okName = p.artName?.toLowerCase().includes(q);
      const okBrand = selectedBrand ? p.brand === selectedBrand : true;
      return okName && okBrand;
    });
  }, [favoriteProducts, search, selectedBrand]);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedItems.length) return;
    Alert.alert("Confirm", "Remove selected items from favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          for (const id of selectedItems) await toggleProductFavorite(id);
          setSelectedItems([]);
          setIsSelectMode(false);
        },
      },
    ]);
  };

  const handleDeleteAll = () => {
    if (!favoriteProducts.length) return;
    Alert.alert("Confirm", "Are you sure you want to remove ALL favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove All",
        style: "destructive",
        onPress: async () => {
          for (const p of favoriteProducts) await toggleProductFavorite(p._id);
          setSelectedItems([]);
          setIsSelectMode(false);
        },
      },
    ]);
  };

  const handleSwipeableOpen = (ref: any) => {
    if (openRowRef.current && openRowRef.current !== ref) {
      openRowRef.current.close();
    }
    openRowRef.current = ref;
  };

  return (
    <View className="flex-1 bg-gray-50">
      {isSelectMode ? (
        <View className="flex-row justify-between items-center bg-white pt-14 pb-3 px-4 border-b border-gray-100">
          <Pressable
            onPress={() => {
              setIsSelectMode(false);
              setSelectedItems([]);
            }}
            className="p-1.5"
          >
            <ArrowLeft size={22} color="black" />
          </Pressable>

          <Text className="text-lg font-semibold text-gray-900">
            Select Items
          </Text>

          <Pressable
            onPress={handleDeleteAll}
            disabled={!favoriteProducts.length}
            className={`flex-row items-center ${
              favoriteProducts.length ? "opacity-100" : "opacity-40"
            }`}
          >
            <Trash2 size={20} color="#ef4444" />
            <Text className="ml-1 text-sm text-red-500 font-medium">
              Delete All
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="pt-14 px-4 pb-3 border-b border-gray-100 bg-white">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-semibold text-gray-900">
              Favorite List
            </Text>
            <Pressable
              onPress={() => {
                setIsSelectMode(true);
                setSelectedItems([]);
              }}
              className="px-3 py-1.5 bg-gray-100 rounded-md"
            >
              <Text className="text-gray-700 text-sm font-medium">
                Multi Select
              </Text>
            </Pressable>
          </View>

          <SearchBar
            value={search}
            onChangeText={debouncedSearch}
            placeholder="Search by art name..."
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => setSelectedBrand("")}
                className={`flex-row items-center py-2 px-4 rounded-md border ${
                  selectedBrand === ""
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white"
                }`}
              >
                <LayoutGrid
                  size={16}
                  color={selectedBrand === "" ? "white" : "black"}
                />
                <Text
                  className={`ml-1 text-sm ${
                    selectedBrand === "" ? "text-white" : "text-gray-800"
                  }`}
                >
                  All
                </Text>
              </Pressable>

              {brands.map((brand, i) => {
                const active = selectedBrand === brand;
                return (
                  <Pressable
                    key={i}
                    onPress={() => setSelectedBrand(active ? "" : brand)}
                    className={`py-2 px-4 rounded-md border ${
                      active
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        active ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {brand}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 120,
          paddingTop: isSelectMode ? 10 : 10,
        }}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <Text className="text-gray-400 text-base">
              No favorite items yet.
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Add your favorite art pieces to see them here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCardHorizontal
            product={item}
            isSelectMode={isSelectMode}
            checked={selectedItems.includes(item._id)}
            onToggleSelect={() => toggleSelect(item._id)}
            onPress={() => router.push(`/product/${item._id}`)}
            onToggleFavorite={() => toggleProductFavorite(item._id)}
            onDelete={() => toggleProductFavorite(item._id)}
            onSwipeableOpen={handleSwipeableOpen}
          />
        )}
      />

      {isSelectMode && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-5 flex-row justify-between items-center">
          <Text className="text-gray-700 text-sm">
            {selectedItems.length} item(s) selected
          </Text>
          <Pressable
            onPress={handleDeleteSelected}
            disabled={!selectedItems.length}
            className={`px-5 py-2 rounded-lg ${
              selectedItems.length ? "bg-red-500" : "bg-red-300"
            }`}
          >
            <Text className="text-white font-semibold text-sm">
              Delete Selected
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default FavoriteScreen;
