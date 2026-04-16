import { create } from "zustand";
import api from "@/lib/axios";

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    discountPercent: number;
    images: { url: string; isDefault: boolean }[];
    variants: {
      id: string;
      sku: string;
      size: string | null;
      color: string | null;
      price: number;
      stock: number;
    }[];
    category: { name: string; slug: string } | null;
  };
}

interface WishlistState {
  items: WishlistItem[];
  wishlistedIds: Set<string>; // Set of productIds for O(1) checks
  isLoading: boolean;

  fetchWishlist: () => Promise<void>;
  fetchIds: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  wishlistedIds: new Set(),
  isLoading: false,

  // Fetch full list (used for /wishlist page)
  fetchWishlist: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get("/wishlist");
      const items: WishlistItem[] = data.data;
      set({
        items,
        wishlistedIds: new Set(items.map((item) => item.productId)),
      });
    } catch {
      set({ items: [], wishlistedIds: new Set() });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch only productId array (used during login for fast state sync, avoids loading full data)
  fetchIds: async () => {
    try {
      const { data } = await api.get("/wishlist/ids");
      set({ wishlistedIds: new Set(data.data as string[]) });
    } catch {
      set({ wishlistedIds: new Set() });
    }
  },

  // Toggle favorite / unfavorite (optimistic update)
  toggle: async (productId: string) => {
    const { wishlistedIds } = get();
    const alreadyWishlisted = wishlistedIds.has(productId);

    // Immediate UI update (optimistic)
    const newIds = new Set(wishlistedIds);
    if (alreadyWishlisted) {
      newIds.delete(productId);
    } else {
      newIds.add(productId);
    }
    set({ wishlistedIds: newIds });

    try {
      await api.post("/wishlist/toggle", { productId });
      // If deleted, also update the items list
      if (alreadyWishlisted) {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      }
    } catch {
      // Rollback on error
      set({ wishlistedIds });
    }
  },

  isWishlisted: (productId: string) => {
    return get().wishlistedIds.has(productId);
  },

  clearWishlist: () => set({ items: [], wishlistedIds: new Set() }),
}));
