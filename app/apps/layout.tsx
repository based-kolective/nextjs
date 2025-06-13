import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import AppsLayout from "@/components/layout/AppsLayout";

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
    console.log("RootLayout rendered");

  return (
    <AppsLayout>
      {children}
    </AppsLayout>
  );
}
