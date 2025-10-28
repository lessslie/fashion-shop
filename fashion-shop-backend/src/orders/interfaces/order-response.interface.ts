import { OrderStatus } from '../entities/order.entity';

export interface OrderResponse {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItemSummary[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemSummary {
  id: string;
  productName: string;
  variantSize: string;
  variantColor: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}