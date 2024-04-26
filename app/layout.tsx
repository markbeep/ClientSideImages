import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cursed Images",
  description: "Upload an image to see cursedness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-custom-grey bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}
