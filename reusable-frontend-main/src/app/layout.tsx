import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/shared/providers";
import { env } from "@/shared/config/env";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: true });

export const metadata: Metadata = {
  title: { default: env.APP_NAME, template: `%s | ${env.APP_NAME}` },
  description: env.APP_DESCRIPTION,
  applicationName: env.APP_NAME,
  metadataBase: new URL(env.SITE_URL),
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

type RootLayoutProps = { children: React.ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
