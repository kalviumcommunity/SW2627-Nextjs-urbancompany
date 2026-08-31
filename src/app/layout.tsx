import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Urban Company",
  description: "Customer Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}