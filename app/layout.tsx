// Root layout: minimal HTML shell — locale and metadata set in [locale]/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
