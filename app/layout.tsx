import type { Metadata } from "next";

import "./globals.css";
import FadeInProvider from "./fadeProvider";

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
        <div className="min-h-screen relative" id="gradient">
          <FadeInProvider>
            <main className="flex min-h-screen flex-col items-center justify-center relative">
              {children}
            </main>
          </FadeInProvider>
        </div>
      </body>
    </html>
  );
}
