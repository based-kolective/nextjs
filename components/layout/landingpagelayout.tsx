"use client";

import dynamic from "next/dynamic";

const Providers = dynamic(
  () => import("../providers").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="bg-[#000] overflow-hidden">
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
