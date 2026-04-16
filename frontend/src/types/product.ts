export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  specifications: any | null; // Kiểu JSON từ Prisma
  discountPercent: number;
  currentPrice: number; // Trường được tính toán từ Backend
  category: {
    name: string;
    slug: string;
  } | null;
  images: {
    url: string;
    isDefault: boolean;
  }[];
  variants: {
    id: string;
    sku: string;
    size: string | null;
    color: string | null;
    price: number;
    stock: number;
  }[];
  createdAt: string;
}

export interface Category {
  id: string;
  label: string;
  image: string;
}
