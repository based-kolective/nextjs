"use client"

import Link from "next/link";
import { Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
import clsx from "clsx";
import { useState } from "react";
import { WalletComponents } from "./../wallet";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { WalletButton } from "../ui/WalletButton";

const navItems = [
  {
    href: "/apps",
    label: "DISCOVER"
  },
];

export default function AppsNavbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      maxWidth="full"
      position="static"
      className="backdrop-saturate-100 z-[100] px-12"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
    >
      <NavbarContent className="basis-1/5 xl:basis-full hidden xl:flex xl:flex-row items-center" justify="start">
        <Link href="/apps" title="Home">
          <Image
            src="/images/kolective.svg"
            alt="Kolective"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <div className="relative flex items-center w-fit">
          <div className="realtive flex ps-4 gap-4 items-center">
            {navItems.map((item) => (
              <NavbarItem
                key={item.href}
                className="relative navbar-item"
              >
                <Link
                  className={clsx(
                    "text-sm font-normal px-4 py-2 hover:bg-slate-700/20 transition-colors rounded-md",
                    pathname.startsWith(item.href) ? "text-blue-500" : "text-gray-400"
                  )}
                  href={item.href}
                >
                  <span className="z-10">{item.label}</span>
                </Link>
              </NavbarItem>
            ))}
          </div>
        </div>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden xl:flex basis-1/5 xl:basis-full items-center mb-3 pt-3" justify="end">
        <NavbarItem className="hidden xl:flex items-center gap-4">
          <WalletComponents />
          <WalletButton />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu*/}
      <NavbarContent className="xl:hidden basis-1 pl-4">
        <div className="flex justify-between items-center w-full">
          <NavbarMenuToggle className="p-5 -ml-5" />

          <div className="flex flex-row gap-3 items-center">
            <WalletComponents />
            <WalletButton />
          </div>
        </div>
      </NavbarContent>

      <NavbarMenu className="z-[1000] absolute inset-0 full-height bg-background/50">
        <div className="mx-4 flex-col gap-5 flex-grow inline-flex py-10">
          <div className="inline-flex flex-col gap-5">
            {navItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={clsx(
                    "border-l-2 pl-5 h-10",
                    pathname.startsWith(item.href) ? "border-primary text-primary" : "border-transparent"
                  )}
                  color="foreground"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
};
