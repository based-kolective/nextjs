"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TweetCard } from "@/components/tweet-card/tweet-card";
import { ClientTweetCard } from "@/components/tweet-card/tweet-card-client";
 

export const SkeletonTwo = () => {
  const images = [
    "/images/nft1.jpg",
    "/images/nft2.jpg",
    "/images/nft3.jpg",
    "/images/nft4.jpg",
    "/images/nft5.jpg",
    "/images/nft6.jpg",
    "/images/nft7.jpg",
    "/images/nft8.jpg",
    "/images/nft9.jpg",
    "/images/nft10.jpg",
  ];

  // <TweetCard id="1441032681968212480" />
  const tweet = [
    "1931695768223760632",
    "1927036419396030691"
  ];

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
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="w-full">
          <ClientTweetCard id={tweet[currentTweetIndex]} className="border-neutral-700 !w-full" />
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
    </div>
  );
};


export default function Page() {
  return (
    <section id="home" className="flex flex-col w-full h-full mt-40">
      <div className="flex w-full flex-row justify-around z-10">

        <section className="w-full md:w-1/2 mt-20">
          <h1 className="font-bricolage font-bold text-8xl text-white mb-2">
            Kolective
          </h1>
          <h2 className="font-bricolage font-semibold text-4xl text-white mb-8">
            Invest With Confidence
          </h2>
          <p className="subheading max-w-2xl mb-12 text-gray-300">
 Automate your trades based on strategies from your favorite Key Opinion Leaders (KOLs). Connect your wallet, choose the experts you trust, and let Kolective handle the rest—so you can stay informed and in control, without the stress of constant monitoring.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-6 py-3 rounded-md btn-text hover:bg-gray-200 transition-colors">
              Start Investing
            </button>
          </div>
        </section>

        <section className="w-full md:w-1/2 right flex justify-center h-full items-center">
          <SkeletonTwo />
        </section>
      </div>
    </section>
  );
}
