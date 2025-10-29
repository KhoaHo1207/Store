import axiosConfig from "@/config/axiosConfig";
import { ApiResponse, GetProductsParamsProps, ProductTypes } from "@/types";

export const fetchProductsService = async (
  params: GetProductsParamsProps = {}
): Promise<ApiResponse<ProductTypes[]>> => {
  try {
    const query = {
      page: params.page || 1,
      limit: params.limit || 6,
      ...(params.search && { search: params.search }),
      ...(params.brand && { brand: params.brand }),
      ...(params.sort && { sort: params.sort }),
    };

    const response = await axiosConfig.get<ApiResponse<ProductTypes[]>>(
      "/product",
      {
        params: query,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while fetching products:", error);
    throw error;
  }
};

export const fetchProductByIdService = async (id: string) => {
  try {
    const response = await axiosConfig.get(`/product/${id}`);
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while fetch product by id", error);
    throw error;
  }
};

export const toggleProductFavoriteService = async (id: string) => {
  try {
    const response = await axiosConfig.put(`/favorite`, {
      productId: id,
    });
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while toggle product favorite", error);
    throw error;
  }
};

export const getFavoriteProductsService = async () => {
  try {
    const response = await axiosConfig.get("/favorite");
    return response.data;
  } catch (error) {
    console.log("Something went wrong while get favorite products", error);
    throw error;
  }
};

export const getReviewByProductIdService = async (id: string) => {
  try {
    const response = await axiosConfig.get(`/product/${id}/review`);
    return response.data;
  } catch (error) {
    console.log("Something went wrong while get product review", error);
    throw error;
  }
};
