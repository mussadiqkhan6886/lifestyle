import Footer from "@/components/client/Footer";
import Header from "@/components/client/Header";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lifestyleshoppinguk.com"), 

  title: {
    default: "Lifestyle Shopping UK | Premium imports from UK, USA & UAE",
    template: "%s | Lifestyle Shopping UK",
  },

  description:
    "Discover premium fashion, men watches, women watches, women footwear, bags and clothing products at Lifestyle Shopping UK imported from the UK, USA & UAE. Shop the latest trends today.",

  keywords: [
    "lifestyle shopping uk",
    "fashion online uk",
    "clothing uk",
    "beauty products uk",
    "premium lifestyle store",
    "online shopping uk",
  ],

  authors: [{ name: "Lifestyle Shopping UK" }],
  creator: "Lifestyle Shopping UK",
  publisher: "Lifestyle Shopping UK",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.lifestyleshoppinguk.com",
    siteName: "Lifestyle Shopping UK",
    title: "Lifestyle Shopping UK | Premium imports from UK, USA & UAE",
    description:
      "Shop premium fashion, clothing and lifestyle products, UK, USA & UAE imported.",
    images: [
      {
        url: "/og-image.jfif",
        width: 1200,
        height: 630,
        alt: "Lifestyle Shopping UK",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lifestyle Shopping UK | Premium imports from UK, USA & UAE",
    description:
      "Shop premium fashion, clothing and lifestyle products, UK , USA & UAE.",
    images: ["/og-image.jfif"],
  },

  alternates: {
    canonical: "https://www.lifestyleshoppinguk.com",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  category: "ecommerce",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<div className="h-20 absolute" />}>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}