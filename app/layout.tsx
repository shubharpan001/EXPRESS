import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EXPRESS — Real-World Social Friends",
  description: "Connect with people sharing your journey.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
