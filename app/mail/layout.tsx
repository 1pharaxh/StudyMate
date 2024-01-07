import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { CanvasProvider } from "@/hooks/CanvasContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Dashboard | Study Mate",
  description: "Student Dashboard | Study Mate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CanvasProvider>
        <body className={inter.className}>{children}</body>
      </CanvasProvider>
    </html>
  );
}
