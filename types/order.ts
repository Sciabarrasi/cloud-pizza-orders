export interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pizzaType: string;
  size: 'small' | 'medium' | 'large';
  quantity: number;
  toppings: string[];
  total: number;
  status: 'pending' | 'preparing' | 'baking' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedTime?: number;
  specialInstructions?: string;
  customerId?: string;
}

export type CreateOrderRequest = Omit<Order, 'orderId' | 'createdAt' | 'status'> & {
  status?: Order['status'];
};