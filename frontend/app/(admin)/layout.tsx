import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Dashboard | Lifestyle shopping",
  description: 'Manage products, orders, customers, and reviews.',
  robots: {
    index: false,
    follow: false
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    <AdminHeader />
      {children}
    </>
  );
}
