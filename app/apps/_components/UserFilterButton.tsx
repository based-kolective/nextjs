"use client";

import { motion } from "framer-motion";

interface UserFilterButtonProps {
  selectedCount: number;
  onClick: () => void;
}

export const UserFilterButton: React.FC<UserFilterButtonProps> = ({
  selectedCount,
  onClick,
}) => {  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center justify-center w-10 h-10 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/50 hover:border-gray-600/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 backdrop-blur-sm group"
      title={selectedCount > 0 ? `${selectedCount} user${selectedCount !== 1 ? 's' : ''} selected` : 'Filter users'}
    >
      <svg 
        className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
        />
      </svg>
      
      {selectedCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
        >
          <span className="text-white text-xs font-bold font-bricolage">
            {selectedCount > 9 ? '9+' : selectedCount}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
};
