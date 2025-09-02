import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather Now - Current Weather Conditions",
  description: "Get current weather conditions for any city. Ready to check the weather?",

  keywords: ["weather", "forecast", "outdoor", "climate", "temperature"],
  authors: [{ name: "Weather Now Team" }],
  openGraph: {
    title: "Weather Now",
    description: "Current weather conditions for any city",
    url: "https://weather-now.com",
    siteName: "Weather Now",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather Now",
    description: "Current weather conditions for any city"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
