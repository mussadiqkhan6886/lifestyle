export const metadata = {
  title: "Login | Lifestyle shopping uk",
  description: "Login to your Lifestyle Shopping UK admin account",
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
