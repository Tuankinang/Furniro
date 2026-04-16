import type { Metadata } from "next";
import { Poppins, Montserrat, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Furniro — Discover Our New Collection",
  description:
    "Furniro is a premium furniture store offering stylish and modern furniture for every room.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        poppins.variable,
        montserrat.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: "14px",
              borderRadius: "10px",
              padding: "14px 18px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            },
            success: {
              iconTheme: { primary: "#B88E2F", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
