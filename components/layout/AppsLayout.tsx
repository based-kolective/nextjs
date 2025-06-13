"use client";

import { Link } from "@heroui/link";
import dynamic from "next/dynamic";

const AppsNavbar = dynamic(() => import("../layout/AppsNavbar").then((mod) => mod.default), {
  ssr: false,
});
const Providers = dynamic(
  () => import("../providers").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen w-screen flex flex-col justify-between antialiased mx-auto">
        <AppsNavbar />
        <div className="flex flex-col w-full mx-auto text-white">
          {children}
        </div>

      </div>
    </Providers>
  );
}
