import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test – Persönlichkeit in Situationen",
  description: "15 neutrale fiktive Situationen zur persönlichen Selbstreflexion.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
