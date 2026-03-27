import Link from "next/link";
import NewsletterForm from "@/components/ui/NewsletterForm";

const footerLinks = {
  Links: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Help: [
    { href: "/payment", label: "Payment Options" },
    { href: "/returns", label: "Returns" },
    { href: "/privacy", label: "Privacy Policies" },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 pt-[48px] pb-[36px]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-[48px]">
          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-bold text-[24px] text-black font-montserrat">
              Furniro.
            </span>
            <p className="text-sm text-[#9F9F9F] leading-6 max-w-[220px]">
              400 University Drive Suite 200 Coral Gables, FL 33134 USA
            </p>
          </div>

          {/* Col 2 — Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-[#9F9F9F] uppercase tracking-wider">
              Links
            </h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.Links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-black hover:text-[#B88E2F] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Help */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-[#9F9F9F] uppercase tracking-wider">
              Help
            </h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.Help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-black hover:text-[#B88E2F] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-[#9F9F9F] uppercase tracking-wider">
              Newsletter
            </h4>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-[#9F9F9F]">
            2023 Furniro. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
