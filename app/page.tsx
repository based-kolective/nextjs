// import { redirect } from "next/navigation";
// import LandingPageLayout from "@/components/layout/landingpagelayout";
import Home from "./home/page";
import dynamic from "next/dynamic";

import { Link } from "@heroui/link";
const Navbar = dynamic(() => import("./../components/navbar").then(mod => mod.default), {
});
import "@/styles/globals.css";

export default function Page() {
  return (
    <div className="min-h-screen w-screen flex flex-col justify-between antialiased max-w-7xl mx-auto">
      <div className="flex flex-col flex-1 pb-5 px-5 sm:px-10 items-center w-full mx-auto text-white">
        <Navbar />
        <Home />
      </div>
      <footer className="w-full flex items-center justify-center py-3 mb-5">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.coinbase.com/"
          title="coinbase"
        >
          <span className="text-default-600">Built in</span>
          <p className="text-warning">Coinbase</p>
        </Link>
      </footer>
    </div>
  );
}
