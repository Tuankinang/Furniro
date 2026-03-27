import { categories } from "@/lib/data";
import { Category } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryCard from "@/components/ui/CategoryCard";

const BrowseRangeSection = () => {
  return (
    <section className="w-full bg-white py-[56px] md:py-[70px]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-[52px]">
        {/* Header */}
        <SectionHeader
          title="Browse The Range"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category: Category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseRangeSection;
