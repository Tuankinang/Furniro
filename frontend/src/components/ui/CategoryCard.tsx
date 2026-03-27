import Image from "next/image";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center gap-[30px] cursor-pointer group">
      {/* Image */}
      <div className="w-full aspect-square overflow-hidden rounded-sm relative">
        <Image
          src={category.image}
          alt={category.label}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {/* Label */}
      <span className="text-xl md:text-[20px] font-semibold text-[#3A3A3A] group-hover:text-[#B88E2F] transition-colors duration-200">
        {category.label}
      </span>
    </div>
  );
};

export default CategoryCard;
