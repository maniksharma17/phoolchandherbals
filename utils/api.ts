// frontend/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  IProduct,
  ICart,
  IOrder,
  IReview,
  IUser,
  IVariant,
  ICategory
} from '../types/index'; 
import getOrCreateSessionId from "@/utils/sessionId";
import { useCartStore } from '@/store/cartStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: attach token 
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401 on client
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      // redirect to login (optional: use router instead of href)
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

/* ---------- helper DTOs / types ---------- */

export type Params = Record<string, any>;

export interface CreateOrderDto {
  products: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number; 
  }[];
  customerInfo: Partial<IOrder['customerInfo']>;
  paymentMethod?: string;
}

export interface IPaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  [key: string]: any;
}

export interface IVerifyPaymentResult {
  success: boolean;
  [key: string]: any;
}

/* ---------- Products API ---------- */

export const getProducts = async (params: Params = {}): Promise<IProduct[]> => {
  const res = await api.get<{data: IProduct[]}>('/products', { params });
  return res.data.data;
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const res = await api.get<{data: IProduct}>(`/products/${id}`);
  return res.data.data;
};

export const searchProducts = async (query: string, filters: Params = {}): Promise<IProduct[]> => {
  const res = await api.get<IProduct[]>('/products/search', { params: { q: query, ...filters } });
  return res.data;
};

export const getRandomProducts = async (limit: number = 8): Promise<IProduct[]> => {
  try {
    // fetch 12 products (or all if fewer)
    const res = await api.get(`/products?limit=12`);
    const products: IProduct[] = res.data.data;

    // shuffle
    const shuffled = [...products].sort(() => Math.random() - 0.5);

    // return only the requested number
    return shuffled.slice(0, limit);
  } catch (err) {
    console.error("Error fetching random products:", err);
    return [];
  }
}

/* ---------- Categories API ---------- */


export const getCategories = async (params: Params = {}): Promise<ICategory[]> => {
  const res = await api.get<{data: ICategory[]}>('/categories', { params });
  return res.data.data;
};


/* ---------- Cart API ---------- */

// variantParam: either variantId or partial variant snapshot used by your server
export const addToCart = async (
  productId: string,
  quantity = 1,
  variant?: Partial<IVariant> | { variantId?: string }
): Promise<ICart> => {
  const sessionId = await getOrCreateSessionId();
  
  const res = await api.post<ICart>('/cart/add', { productId, quantity, variant, sessionId });
  return res.data;
};

export const getCart = async (): Promise<ICart> => {
  const sessionId = await getOrCreateSessionId();
  const res = await api.post<{data: ICart}>(`/cart`, {
    sessionId
  });
  
  return res.data.data;
};

export const updateCart = async (itemId: string, quantity: number): Promise<ICart> => {
  const sessionId = await getOrCreateSessionId();
  const res = await api.put<ICart>('/cart/update', { itemId, quantity, sessionId });
  return res.data;
};

export const removeFromCart = async (productId: string): Promise<ICart> => {
  const sessionId = await getOrCreateSessionId();
  const res = await api.post<ICart>(`/cart/remove/${productId}`, { sessionId });
  return res.data;
};

export const clearCart = async (): Promise<ICart> => {
  const res = await api.delete<ICart>('/cart/clear');
  return res.data;
};

/* ---------- Orders API ---------- */

export const createOrder = async (orderData: CreateOrderDto): Promise<IOrder> => {
  const sessionId = await getOrCreateSessionId();
  const res = await api.post<{ data: IOrder }>('/orders', {...orderData, sessionId});
  return res.data.data;
};

export const getOrders = async (): Promise<IOrder[]> => {
  const res = await api.get<IOrder[]>('/orders');
  return res.data;
};

export const getMyOrders = async (): Promise<IOrder[]> => {
  const res = await api.get<{data: IOrder[]}>('/orders/user/mine');
  return res.data.data;
};

export const getOrderById = async (id: string): Promise<IOrder> => {
  const res = await api.get<{data: IOrder}>(`/orders/${id}`);
  return res.data.data;
};

export const cancelOrder = async (id: string): Promise<IOrder> => {
  const res = await api.delete<{data: IOrder}>(`/orders/${id}`);
  return res.data.data;
};

/* ---------- Payment API ---------- */

export const createPayment = async (orderId: string): Promise<IPaymentOrder> => {
  const res = await api.post<IPaymentOrder>('/payment/order', { orderId });
  return res.data.data;
};

export const verifyPayment = async (paymentData: any): Promise<IVerifyPaymentResult> => {
  const sessionId = await getOrCreateSessionId();
  const res = await api.post<IVerifyPaymentResult>('/payment/verify', {...paymentData, sessionId});
  return res.data;
};

/* ---------- Shipping API ---------- */

export const getShippingCost = async (): Promise<any> => {
  const res = await api.get(`/shipping/cost`);
  return res.data.cost;
};

export const createShipment = async (orderId: string, shippingDetails: Record<string, any>): Promise<any> => {
  const res = await api.post('/shipping/create', { orderId, ...shippingDetails });
  return res.data;
};

export const trackShipment = async (trackingId: string): Promise<any> => {
  const res = await api.get(`/shipping/track/${trackingId}`);
  return res.data;
};

/* ---------- Auth API ---------- */

export interface AuthResponse {
  token: string;
  user: IUser;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const sessionId = await getOrCreateSessionId();
  const res = await api.post<AuthResponse>('/auth/login', { email, password, sessionId });
  return res.data;
};

export const register = async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  const sessionId = await getOrCreateSessionId();
  const res = await api.post<AuthResponse>('/auth/register', {...userData, sessionId});
  return res.data;
};

export const getProfile = async (): Promise<IUser> => {
  const res = await api.get<IUser>('/auth/profile');
  return res.data;
};

export const updateProfile = async (userData: Partial<IUser>): Promise<IUser> => {
  const res = await api.put<IUser>('/auth/profile', userData);
  return res.data;
};

/* ---------- Contact API ---------- */

export const sendContactMessage = async (messageData: { name: string; email: string; message: string }): Promise<any> => {
  const res = await api.post('/contact', messageData);
  return res.data;
};

/* ---------- Reviews API ---------- */

export const getProductReviews = async (productId: string): Promise<IReview[]> => {
  const res = await api.get<IReview[]>(`/products/${productId}/reviews`);
  return res.data;
};

export const addProductReview = async (productId: string, reviewData: { name: string; rating: number; comment?: string }): Promise<IReview> => {
  const res = await api.post<IReview>(`/products/${productId}/reviews`, reviewData);
  return res.data;
};

export default api;
