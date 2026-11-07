import Footer from "@/components/client/Footer";
import Header from "@/components/client/Header";
import { Metadata } from "next";
import { Suspense } from "react";


export const metadata : Metadata = {
  title: "Lifestyle shopping uk"
} 

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<div className="h-20" />}>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
