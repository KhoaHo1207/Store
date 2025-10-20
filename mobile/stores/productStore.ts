import { create } from "zustand";
import { fetchProductsService } from "@/services/productService";
import { GetProductsParamsProps, Pagination, ProductTypes } from "@/types";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProductState {
  products: ProductTypes[];
  categories: string[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean | null;
  lastFetched: number | null;
  fetchProducts: (params?: GetProductsParamsProps) => Promise<void>;
  loadMoreProducts: (params?: GetProductsParamsProps) => Promise<void>;
  resetProducts: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      loading: false,
      loadingMore: false,
      error: null,
      page: 1,
      hasMore: null,
      lastFetched: null,

      fetchProducts: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await fetchProductsService({
            ...params,
            page: 1,
            limit: 6,
          });

          if (res.success) {
            set({
              products: res.data,
              page: 1,
              hasMore: res.data.length === 6,
            });
          } else {
            set({ error: res.message });
          }
        } catch (err: any) {
          set({ error: err.message || "Fetch failed" });
        } finally {
          set({ loading: false });
        }
      },

      loadMoreProducts: async (params) => {
        const { page, hasMore, loadingMore } = get();
        if (!hasMore || loadingMore) return;

        set({ loadingMore: true });
        try {
          const nextPage = page + 1;
          const res = await fetchProductsService({
            ...params,
            page: nextPage,
            limit: 6,
          });

          if (res.success && res.data.length > 0) {
            set({
              products: [...get().products, ...res.data],
              page: nextPage,
              hasMore: res.data.length === 6,
            });
          } else {
            set({ hasMore: false });
          }
        } catch (err: any) {
          set({ error: err.message || "Load more failed" });
        } finally {
          set({ loadingMore: false });
        }
      },

      resetProducts: () => {
        set({
          products: [],
          page: 1,
          hasMore: true,
          error: null,
        });
      },
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        products: state.products,
        page: state.page,
        hasMore: state.hasMore,
      }),
    }
  )
);
