import AdminHeader from "@/components/admin/AdminHeader";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    <AdminHeader />
      {children}
    </>
  );
}
