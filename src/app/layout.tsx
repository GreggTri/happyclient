import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Happy Client",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-none overflow-y-scroll">
      
      <body
        className={` ${inter.className} min-h-screen bg-background text-text antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
    
  );
}
