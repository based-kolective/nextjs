"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClientTweetCard } from "@/components/tweet-card/tweet-card-client";
import { useRouter } from "next/navigation";
import ButtonSoniclabsCustom from "@/components/button/buttonSonicCustom";

export const SkeletonTwo = () => {
  // <TweetCard id="1441032681968212480" />
  const tweet = ["1931695768223760632", "1922488976973148593"];

  // State to track current tweet index
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);

  // Auto-rotate tweets every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTweetIndex((prevIndex) => (prevIndex + 1) % tweet.length);
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [tweet.length]);
  return (
    <div className="relative flex flex-col items-center h-full overflow-hidden">

      
      <div className="w-full">
        <div className="w-full min-h-[500px] h-auto flex items-center justify-center">
          <div className="w-full min-w-[400px] relative h-full min-h-[500px]">
            {tweet.map((tweetId, index) => (
              <motion.div
                key={tweetId}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index === currentTweetIndex ? 1 : 0,
                  scale: index === currentTweetIndex ? 1 : 0.95,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute top-0 left-0 pt-14 w-full h-auto"
                style={{
                  pointerEvents: index === currentTweetIndex ? "auto" : "none",
                  zIndex: index === currentTweetIndex ? 1 : 0,
                }}
              >
                <ClientTweetCard
                  id={tweetId}
                  className="border-neutral-700 !w-full !max-w-none !min-w-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" /> */}
      {/* <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" /> */}
    </div>
  );
};


export default function HomeContent() {
  const router = useRouter();

  return (
    <section id="home" className="flex flex-col w-full h-full mt-40">
      <div className="flex w-full flex-col md:flex-row justify-around z-10">
        <section className="w-full md:w-1/2 mt-20">
          {/* <Link className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs rounded-full"
            href="https://incubase.xyz/"
            target="_blank">
            Part of <span className="text-blue-500 pl-1">IncuBase</span>
          </Link> */}
          <h1 className="font-bricolage font-bold text-8xl text-white mb-2">
            Kolective
          </h1>
          <h2 className="font-bricolage font-semibold text-4xl text-white mb-8">
            Invest With Confidence
          </h2>
          <p className="subheading max-w-2xl mb-12 text-gray-300">
            Automate your trades based on strategies from your favorite Key
            Opinion Leaders (KOLs). Connect your wallet, choose the experts you
            trust, and let Kolective handle the rest—so you can stay informed
            and in control, without the stress of constant monitoring.
          </p>
          <div className="flex space-x-4">
            <div>
              <ButtonSoniclabsCustom onClick={() => router.push("/apps")}>
                Start Investing
              </ButtonSoniclabsCustom>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 right flex justify-center h-full items-center">
          <SkeletonTwo />
        </section>
      </div>
    </section>
  );
}
