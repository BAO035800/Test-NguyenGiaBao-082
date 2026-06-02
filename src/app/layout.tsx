import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VFeed — Video dạng dọc",
  description: "Ứng dụng xem video dạng dọc kiểu TikTok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-black text-white">
        {/* App shell: rendered once for every route. The NavBar derives its
            active state from the current pathname; each page renders into the
            sidebar-offset content area below. */}
        <main className="relative h-[100dvh] w-full overflow-hidden bg-black">
          {/* Content offset to leave room for the desktop sidebar (mobile uses
              the bottom nav). Each page fills this area and scrolls internally. */}
          <div className="h-full w-full md:pl-20 lg:pl-56">{children}</div>

          <NavBar />
        </main>
      </body>
    </html>
  );
}
