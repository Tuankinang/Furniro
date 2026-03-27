interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

const SectionHeader = ({
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) => {
  return (
    <div
      className={`flex flex-col gap-2 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <h2 className="text-3xl md:text-[40px] font-bold text-[#3A3A3A] font-poppins">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-[#666666] max-w-[600px]">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
