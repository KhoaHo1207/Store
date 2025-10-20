import axiosConfig from "@/config/axiosConfig";
import { ApiResponse, GetProductsParamsProps, ProductTypes } from "@/types";

// await getProducts({ brand: "Rolex", search: "gold", sort: "price_asc", page: 3 });
export const fetchProductsService = async (
  params: GetProductsParamsProps = {}
): Promise<ApiResponse<ProductTypes[]>> => {
  try {
    const query = {
      page: params.page || 1,
      limit: params.limit || 6,
      ...(params.search && { artName: params.search }),
      ...(params.brand && { artName: params.brand }),
      ...(params.sort && { artName: params.sort }),
    };
    const response = await axiosConfig.get<ApiResponse<ProductTypes[]>>(
      "/product",
      {
        params: query,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while fetching products", error);
    throw error;
  }
};
