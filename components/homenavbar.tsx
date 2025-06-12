"use client";

import Link from "next/link";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { BookText } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";
import { WalletComponents } from "./wallet";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonSoniclabsCustom from "./button/buttonSonicCustom";


export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();


  return (
    <HeroUINavbar
      maxWidth="full"
      position="static"
      className="absolute rounded-full mt-5 backdrop-saturate-100 z-[100] max-w-[1200px] left-1/2 top-0 transform -translate-x-1/2"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
    >
      <NavbarContent
        className="basis-1/5 xl:basis-full hidden xl:flex xl:flex-row items-center"
        justify="start"
      >
        <Link href="/home" title="Home">
    Kolective
        </Link>

      </NavbarContent>

      <NavbarContent
        className="hidden xl:flex basis-1/5 xl:basis-full items-center mb-3 pt-3"
        justify="end"
      >
        <NavbarItem className="hidden xl:flex items-center gap-4">
          <ButtonSoniclabsCustom onClick={() => router.push("/apps")}>
            Apps
          </ButtonSoniclabsCustom>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="z-[1000] absolute inset-0 full-height bg-background/50">
        <div className="mx-4 flex-col gap-5 flex-grow inline-flex py-10">
          <div className="inline-flex flex-col gap-5">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={clsx(
                    "border-l-2 pl-5 h-10",
                    pathname.startsWith(item.href)
                      ? "border-primary text-primary"
                      : "border-transparent"
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
          <WalletComponents />
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
}
