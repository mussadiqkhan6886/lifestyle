import { roboto } from "@/lib/fonts";
import "./globals.css";
import TanStackQueryProvider from "@/components/providers/tanstackQueryProvider"
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { Metadata } from "next";

export const metadata : Metadata  =  {
  verification: {
    google: "tJcBXdULIPXzlPoqd-YGMhL39c2pAZQ8CIYbk_INcsw"
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${roboto.className}`}
    >
      <body className="min-h-full flex flex-col">
        <TanStackQueryProvider >
          <CartProvider>
            <Toaster position="top-right" richColors />
            {children}
            </CartProvider>
        </TanStackQueryProvider>
        </body>
    </html>
  );
}
