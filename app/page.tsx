// import { redirect } from "next/navigation";
// import LandingPageLayout from "@/components/layout/landingpagelayout";
import dynamic from "next/dynamic";
import HomeContent from "./component/HomeContent";

import { Link } from "@heroui/link";
const Navbar = dynamic(() => import("./../components/homenavbar").then(mod => mod.default), {
});
import "@/styles/globals.css";


export default function Page() {
  return (
    <div className="h-screen w-screen relative">
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
    <div className="h-screen w-screen flex flex-col justify-between antialiased max-w-7xl mx-auto overflow-y-hidden relative">      
      <div className="flex flex-col flex-1 pb-5 px-5 sm:px-10 items-center w-full mx-auto text-white">
        <Navbar />
        <HomeContent />
      </div>
      <footer className="w-full flex items-center justify-center py-3 mb-5">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.coinbase.com/"
          title="coinbase"
        >
          <span className="text-default-600">Backed by</span>
          <p className="text-blue-500">IncuBase</p>
        </Link>
      </footer>
    </div>
    </div>
  );
}
