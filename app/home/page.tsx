"use client";
import React from "react";
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
    "1931695768223760632"
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-row -ml-8 -mr-10">
        <ClientTweetCard id="1931695768223760632" className="border-white" />
        {/* {tweet.slice(0, 1).map((tw, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <TweetCard id={tw} />
          </motion.div>
        ))} */}
      </div>
      <div className="flex flex-row">
        {images.slice(5, 10).map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
    </div>
  );
};


export default function Page() {
  return (
    <section id="home" className="flex flex-col w-full h-full mt-40">
      <div className="flex justify-around z-10">
        <section className="max-w-lg mt-20">
          <h1 className="font-bricolage font-bold text-8xl text-white mb-2">
            Kolective
          </h1>
          <h2 className="font-bricolage font-semibold text-4xl text-white mb-8">
            Invest With Confidence
          </h2>
          <p className="subheading max-w-2xl mb-12 text-gray-300">
            Kolective connects you with strategies trusted by experienced
            traders and industry leaders. Powered by AI and supported by real
            insights, you can protect your assets, automate trades, and adjust
            your risk level—all in one place.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-6 py-3 rounded-md btn-text hover:bg-gray-200 transition-colors">
              Start Investing
            </button>
          </div>
        </section>
        <section className="max-w-lg right">
          <SkeletonTwo />
        </section>
      </div>
    </section>
  );
}
