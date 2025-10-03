// TYPES

// ---------------- VARIANT ----------------
export interface IVariant {
  _id: string;
  packSize: string;
  price: number;
  cutoffPrice: number;
  stock: number;
  images: string[];
  weight: number;   // in kg
  length: number;   // in cm
  breadth: number;  // in cm
  height: number;   // in cm
}

// ---------------- PRODUCT ----------------
export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  baseImages: string[];
  benefits: string[];
  cures: string[];
  usage?: string;
  ingredients: string[];
  category: string; // categoryId
  tags: string[];
  isActive: boolean;
  variants: IVariant[];
  createdAt: string;
  updatedAt: string;
}

// ---------------- CATEGORY ----------------
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------- REVIEW ----------------
export interface IReview {
  _id: string;
  productId: string;
  userId?: string;
  name: string;
  rating: number; // 1–5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------- USER ----------------
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}

// ---------------- CART ----------------
export interface IProductVariant {
  _id: string;
  packSize: string;
  price: number;
  stock: number;
  images: string[];
}

export interface ICartItem {
  _id: string;
  productId: IProduct;      // populated product
  variant: IProductVariant;  // selected variant
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICart {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  totalAmount: number;       // added to reflect calculated total
  createdAt: string;
  updatedAt: string;
}


// ---------------- ORDER ----------------
export interface IOrderProduct {
  _id: string;
  productId: string;
  variant: {
    packSize: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

export interface IOrder {
  _id: string;
  products: IOrderProduct[];
  customerInfo: {
    name: string;
    email?: string;
    phone?: string;
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    country: string;
  };
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipmentInfo?: {
    shiprocketOrderId?: string;
    awb?: string;
    trackingUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}
