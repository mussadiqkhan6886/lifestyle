import { roboto } from "@/lib/fonts";
import "./globals.css";
import TanStackQueryProvider from "@/components/providers/tanstackQueryProvider"
import { Toaster } from "sonner";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${roboto.className}`}
    >
      <body className="min-h-full flex flex-col">
        <TanStackQueryProvider >
          <Toaster position="top-right" richColors />
          {children}
        </TanStackQueryProvider>
        </body>
    </html>
  );
}
