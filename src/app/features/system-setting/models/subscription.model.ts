export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[]; // feature IDs
  isActive: boolean;
  maxUsers?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentMethod?: string;
  createdAt?: string;
}