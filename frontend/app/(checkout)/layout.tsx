
export const metadata = {
  title: "Checkout | Lifestyle shopping uk",
  description: "checkout of lifestyle shopping uk", 
  robots: {
    index: false,  
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>{children}</>
  );
}
