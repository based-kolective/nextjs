import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ButtonSoniclabsCustom = ({
  delay = 0.1,
  buttonBaseStyles,
  onClick,
  children,
}: {
  delay?: number;
  buttonBaseStyles?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="relative p-[1px] bg-gradient-sonic-mirrored rounded-full animate-gradient cursor-pointer z-20 transform"
      tabIndex={0}
      style={{
        willChange: "transform, filter",
        filter: "brightness(1)",
        transform: "none",
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-sonic-mirrored animate-gradient rounded-full blur-sm group-hover:blur group-hover:brightness-125 transition"></div>
      <div className="relative z-10 bg-black/75 rounded-full flex items-center overflow-hidden opacity-100">
        <div className="px-3 py-1.5 flex items-center gap-x-2.5 opacity-100">
          <span
            className={cn(
              "text-sm font-regular flex items-center",
              buttonBaseStyles
            )}
          >
            {children}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default ButtonSoniclabsCustom;