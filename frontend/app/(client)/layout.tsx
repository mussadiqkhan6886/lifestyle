import Header from "@/components/client/Header";
import { Metadata } from "next";


export const metadata : Metadata = {
  title: "Lifestyle shopping uk"
} 

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
