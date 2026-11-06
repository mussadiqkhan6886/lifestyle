import { roboto } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${roboto.className}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
