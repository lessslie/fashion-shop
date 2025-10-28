import { Cart } from '../entities/cart.entity';

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  totalQuantity: number;
}

export interface CartResponse {
  cart: Cart;
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  totalQuantity: number;
}

export interface CartItemSummary {
  id: string;
  variantId: string;
  quantity: number;
  priceAtAdd: number;
  productName: string;
  size: string;
  color: string;
  currentPrice: number;
  hasDiscount: boolean;
}