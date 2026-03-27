import { Product, Category } from "@/types";

export const categories: Category[] = [
  {
    id: "dining",
    label: "Dining",
    image: "/images/categories/dining.png",
  },
  {
    id: "living",
    label: "Living",
    image: "/images/categories/living.png",
  },
  {
    id: "bedroom",
    label: "Bedroom",
    image: "/images/categories/bedroom.png",
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Syltherine",
    category: "Stylish cafe chair",
    price: 2500000,
    originalPrice: 3500000,
    image: "/images/products/syltherine.png",
    badge: "Sale",
    discount: 30,
  },
  {
    id: "2",
    name: "Leviosa",
    category: "Stylish cafe chair",
    price: 2500000,
    image: "/images/products/leviosa.png",
  },
  {
    id: "3",
    name: "Lolito",
    category: "Luxury big sofa",
    price: 7000000,
    originalPrice: 14000000,
    image: "/images/products/lolito.png",
    badge: "Sale",
    discount: 50,
  },
  {
    id: "4",
    name: "Respira",
    category: "Outdoor bar table and stool",
    price: 500000,
    image: "/images/products/respira.png",
    badge: "New",
    isNew: true,
  },
  {
    id: "5",
    name: "Grifo",
    category: "Night lamp",
    price: 1500000,
    image: "/images/products/grifo.png",
  },
  {
    id: "6",
    name: "Muggo",
    category: "Small mug",
    price: 150000,
    image: "/images/products/muggo.png",
    badge: "New",
    isNew: true,
  },
  {
    id: "7",
    name: "Pingky",
    category: "Cute bed set",
    price: 7000000,
    originalPrice: 14000000,
    image: "/images/products/pingky.png",
    badge: "Sale",
    discount: 50,
  },
  {
    id: "8",
    name: "Potty",
    category: "Minimalist flower pot",
    price: 500000,
    image: "/images/products/potty.png",
    badge: "New",
    isNew: true,
  },
];

export const inspirationRooms = [
  {
    id: "1",
    name: "Inner Peace",
    type: "Bed Room",
    image: "/images/inspiration/inner-peace.png",
  },
  {
    id: "2",
    name: "Natural Touch",
    type: "Living Room",
    image: "/images/inspiration/natural-touch.png",
  },
  {
    id: "3",
    name: "Urban Chic",
    type: "Dining Room",
    image: "/images/inspiration/urban-chic.png",
  },
];

export const galleryImages = [
  "/images/gallery/gallery-1.png",
  "/images/gallery/gallery-2.png",
  "/images/gallery/gallery-3.png",
  "/images/gallery/gallery-4.png",
  "/images/gallery/gallery-5.png",
  "/images/gallery/gallery-6.png",
  "/images/gallery/gallery-7.png",
  "/images/gallery/gallery-8.png",
  "/images/gallery/gallery-9.png",
];
