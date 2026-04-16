import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace("Rp", "Rp. ");
};

export const formatShortPrice = (value: number) => {
  if (value >= 1_000_000_000)
    return `Rp. ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `Rp. ${(value / 1_000_000).toFixed(0)}M`;
  return formatPrice(value);
};
