import Header from "@/components/client/Header";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
