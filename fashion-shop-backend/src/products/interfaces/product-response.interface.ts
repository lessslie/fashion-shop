import { ProductCategory, DiscountType, ProductStatus } from '../entities/product.entity';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  hasDiscount: boolean;
  discountType?: DiscountType;
  discountValue?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  images: string[];
  styleTags: string[];
  categoryTags: string[];
  variants: VariantSummary[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VariantSummary {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  isActive: boolean;
  featuredImage?: string;
}

export interface ProductListResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  status?: ProductStatus;
  isFeatured?: boolean;
  isNew?: boolean;
  search?: string;
}