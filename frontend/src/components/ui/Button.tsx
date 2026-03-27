import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer";

  const variants = {
    primary:
      "bg-[#B88E2F] text-white hover:bg-[#a07828] active:scale-95",
    outline:
      "bg-transparent text-[#B88E2F] border border-[#B88E2F] hover:bg-[#B88E2F] hover:text-white active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-12 py-4 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
};

export default Button;
