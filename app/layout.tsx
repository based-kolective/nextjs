import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
// import DefaultLayout from '@/components/layout/default';
import LandingPageLayout from "@/components/layout/landingpagelayout";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingPageLayout>
      {children}
    </LandingPageLayout>
  );
}
