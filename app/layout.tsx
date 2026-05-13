import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/Provider";

export const metadata: Metadata = {
  title: "Admin — AI Recovery",
  description: "AI Recovery admin management panel",
  robots: "noindex, nofollow",  // keep admin panel out of search engines
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
