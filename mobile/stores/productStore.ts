import {
  fetchProductByIdService,
  fetchProductsService,
  getFavoriteProductsService,
  getReviewByProductIdService,
  toggleProductFavoriteService,
} from "@/services/productService";
import { GetProductsParamsProps, ProductTypes, ReviewTypes } from "@/types";
import { create } from "zustand";

interface ProductState {
  products: ProductTypes[];
  favoriteProducts: ProductTypes[];
  brands: string[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean | null;
  lastFetched: number | null;
  reviews: ReviewTypes[];
  averageRating: number;
  totalRating: number;
  fetchProducts: (params?: GetProductsParamsProps) => Promise<void>;
  loadMoreProducts: (params?: GetProductsParamsProps) => Promise<void>;
  resetProducts: () => void;
  fetchBrands: () => Promise<void>;
  fetchProductById: (id: string) => Promise<ProductTypes | undefined>;
  toggleProductFavorite: (id: string) => Promise<void>;
  getFavoriteProducts: () => Promise<void>;
  fetchReviews: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  brands: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: null,
  lastFetched: null,
  favoriteProducts: [],
  reviews: [],
  averageRating: 0,
  totalRating: 0,
  fetchProducts: async (params?: {
    search?: string;
    brand?: string;
    limit?: number;
    page?: number;
  }) => {
    set({ error: null });

    try {
      const res = await fetchProductsService(params);

      if (res.success) {
        set({
          products: res.data,
          page: params?.page || 1,
          hasMore: res.data.length >= (params?.limit || 6),
        });
      } else {
        set({ error: res.message || "Failed to fetch products" });
      }
    } catch (err: any) {
      console.error("FetchProducts error:", err);
      set({
        error:
          err?.message ||
          "An unexpected error occurred while fetching products",
      });
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

  fetchBrands: async () => {
    try {
      const res = await fetchProductsService({ limit: 100 });
      if (res.success) {
        const brands = Array.from(
          new Set(res.data.map((product: ProductTypes) => product.brand))
        );
        set({ brands });
      }
    } catch (err: any) {
      set({ error: err.message || "Fetch failed" });
    }
  },

  fetchProductById: async (id: string): Promise<ProductTypes | undefined> => {
    try {
      const res = await fetchProductByIdService(id);
      if (res.success) {
        return res.data;
      }
    } catch (err: any) {
      set({ error: err.message || "Fetch failed" });
    }
  },

  toggleProductFavorite: async (id: string): Promise<void> => {
    try {
      const res = await toggleProductFavoriteService(id);

      if (res.success) {
        set((state) => {
          const updatedProducts = state.products.map((product) =>
            product._id === id
              ? { ...product, isFavorite: !product.isFavorite }
              : product
          );

          let updatedFavoriteProducts = [...state.favoriteProducts];
          const product = state.products.find((p) => p._id === id);

          if (product) {
            if (product.isFavorite) {
              updatedFavoriteProducts = updatedFavoriteProducts.filter(
                (item) => item._id !== id
              );
            } else {
              updatedFavoriteProducts = [
                ...updatedFavoriteProducts,
                { ...product, isFavorite: true },
              ];
            }
          }

          return {
            products: updatedProducts,
            favoriteProducts: updatedFavoriteProducts,
          };
        });
      } else {
        set({ error: res.message || "Toggle favorite failed" });
      }
    } catch (error: any) {
      console.error("ToggleFavorite error:", error);
      set({
        error: error?.message || "An error occurred while toggling favorite",
      });
    }
  },

  getFavoriteProducts: async (): Promise<void> => {
    try {
      const res = await getFavoriteProductsService();
      if (res.success) {
        set({ favoriteProducts: res.data });
      }
    } catch (error: any) {
      console.error("ToggleFavorite error:", error);
      set({
        error: error?.message || "An error occurred while toggling favorite",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  fetchReviews: async (id: string): Promise<void> => {
    try {
      const response = await getReviewByProductIdService(id);
      if (response.success) {
        const { reviews, averageRating, totalRating } = response.data;
        set({
          reviews,
          averageRating,
          totalRating,
        });
      }
    } catch (error: any) {
      console.error("ToggleFavorite error:", error);
      set({
        error: error?.message || "An error occurred while etch reviews",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
