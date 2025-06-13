'use client';
import dynamic from "next/dynamic";

const Feeds = dynamic(() => import("./_components/Feeds"), {
  ssr: false,
});

export default function Apps() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center text-white">
      <Feeds />
    </div>
  );
}
