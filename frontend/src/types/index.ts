export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "New" | "Sale";
  discount?: number;
  isNew?: boolean;
}

export interface Category {
  id: string;
  label: string;
  image: string;
}
