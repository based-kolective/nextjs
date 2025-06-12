"use client";

import { Link } from "@heroui/link";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../navbar").then((mod) => mod.default), {
  ssr: false,
});
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
      <body className="bg-[#000] overflow-x-hidden">
        <div
          className="
              absolute
              bottom-0
              -translate-x-1/2
              translate-y-1/2
              w-[40vw]
              h-[40vw]
              max-w-[900px]
              max-h-[900px]
              rounded-full
              bg-gradient-to-br
              from-purple-700
              via-indigo-500
              to-blue-400
              opacity-10
              blur-3xl
              pointer-events-none
              select-none
              -z-1
            "
        />
        <div
          className="
              absolute
              top-0
              right-0
              w-[40vw]
              h-[40vw]
              max-w-[900px]
              max-h-[900px]
              rounded-full
              translate-x-1/2
              -translate-y-1/3
              bg-gradient-to-br
              from-purple-700
              to-blue-500
              opacity-40
              blur-3xl
              pointer-events-none
              select-none
              -z-1
            "
        />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
