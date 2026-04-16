import { create } from "zustand";
import api from "@/lib/axios";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  // UI
  openCart: () => void;
  closeCart: () => void;

  // Data actions (đều gọi API)
  fetchCart: () => Promise<void>;
  addItem: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
}

// Helper: Chuyển data thô từ API sang CartItem[] phẳng
const mapCartItems = (cart: any): CartItem[] => {
  if (!cart?.items) return [];
  return cart.items.map((item: any) => {
    // Tìm vị trí của màu này trong danh sách biến thể (Giống trang Chi tiết)
    const variantIndex =
      item.product?.variants?.findIndex(
        (v: any) => v.color === item.variant?.color,
      ) ?? -1;

    // Lấy ảnh ở vị trí tương ứng, nếu không có thì lấy ảnh mặc định
    const image =
      item.product?.images[variantIndex]?.url ||
      item.product?.images?.find((img: any) => img.isDefault)?.url ||
      item.product?.images?.[0]?.url ||
      "/images/placeholder.png";

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product?.name ?? "",
      price: item.variant?.price ?? 0,
      image,
      size: item.variant?.size ?? "Standard",
      color: item.variant?.color ?? "Standard",
      quantity: item.quantity,
      stock: item.variant?.stock ?? 0,
    };
  });
};

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  isOpen: false,
  isLoading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ items: [] }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get("/cart");
      set({ items: mapCartItems(data.data) });
    } catch {
      // User chưa đăng nhập hoặc token hết hạn → giỏ về rỗng
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity) => {
    const { data } = await api.post("/cart", {
      productId,
      variantId,
      quantity,
    });
    set({ items: mapCartItems(data.data) });
  },

  updateQuantity: async (cartItemId, quantity) => {
    const { data } = await api.put("/cart", { cartItemId, quantity });
    set({ items: mapCartItems(data.data) });
  },

  removeItem: async (cartItemId) => {
    const { data } = await api.delete(`/cart/${cartItemId}`);
    set({ items: mapCartItems(data.data) });
  },
}));
