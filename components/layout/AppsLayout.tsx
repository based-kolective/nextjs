"use client";
import dynamic from "next/dynamic";

const AppsNavbar = dynamic(
  () => import("../layout/AppsNavbar").then((mod) => mod.default),
  {
    ssr: false,
  }
);
const AppsFooter = dynamic(
  () => import("../layout/AppsFooter").then((mod) => mod.default),
  {
    ssr: false,
  }
);
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
      <div className="min-h-screen w-screen flex flex-col justify-start antialiased mx-auto">
        <AppsNavbar />
        <div className="flex flex-col flex-grow w-full h-full text-white">
          {children}
          <AppsFooter />
        </div>
      </div>
    </Providers>
  );
}
