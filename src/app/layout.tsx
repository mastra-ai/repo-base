import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/custom/SiteHeader";
import { MemoizedResourceProvider } from "@/providers/ResourceProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repo Base",
  description:
    "Turn your favorite repository into a knowledge base and get ai powered insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const resourceId = (await cookies()).get("resourceId")?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MemoizedResourceProvider resourceId={resourceId}>
            {children}
          </MemoizedResourceProvider>
          <SiteHeader />
        </ThemeProvider>
      </body>
    </html>
  );
}
