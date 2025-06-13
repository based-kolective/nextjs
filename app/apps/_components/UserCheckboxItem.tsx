"use client";

import { motion } from "framer-motion";

interface UserCheckboxItemProps {
  username: string;
  name: string;
  tweetCount: number;
  isSelected: boolean;
  onToggle: (username: string) => void;
}

export const UserCheckboxItem: React.FC<UserCheckboxItemProps> = ({
  username,
  name,
  tweetCount,
  isSelected,
  onToggle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-3 p-3 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onToggle(username)}
    >
      <div className="relative">
        <motion.div
          className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
            isSelected
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent'
              : 'border-gray-600 group-hover:border-gray-500'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {isSelected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-white absolute top-0.5 left-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.div>
      </div>
      
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg font-bricolage">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="font-bricolage font-medium text-white text-sm truncate group-hover:text-blue-300 transition-colors">
            {name}
          </h4>
          <span className="text-gray-400 text-xs font-bricolage">@{username}</span>
        </div>
        <p className="text-gray-500 text-xs font-bricolage">
          {tweetCount} tweet{tweetCount !== 1 ? 's' : ''}
        </p>
      </div>
    </motion.div>
  );
};
