export interface UserTypes {
  email: string;
  fullName: string;
  password?: string;
  avatar?: string;
  role: string;
  favorite: string;
  cart?: [];
  createdAt: Date;
}

export interface ProductTypes {
  _id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: number;
}

export interface GetProductsParamsProps {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "oldest";
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  pagination?: Pagination;
  data: T;
}
