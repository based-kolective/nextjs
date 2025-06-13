"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { UserCheckboxItem } from "./UserCheckboxItem";

interface Tweet {
  id: string;
  name: string;
  username: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tweets: Tweet[];
  selectedUsers: string[];
  onSelectionChange: (selectedUsers: string[]) => void;
}

const COOKIE_KEY = "feeds_selected_users";

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  tweets,
  selectedUsers,
  onSelectionChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedUsers, setLocalSelectedUsers] = useState<string[]>(selectedUsers);

  // Get unique users with tweet counts
  const uniqueUsers = useMemo(() => {
    const userMap = new Map<string, { name: string; username: string; tweetCount: number }>();
    
    tweets.forEach((tweet) => {
      const existing = userMap.get(tweet.username);
      if (existing) {
        existing.tweetCount++;
      } else {
        userMap.set(tweet.username, {
          name: tweet.name,
          username: tweet.username,
          tweetCount: 1,
        });
      }
    });
    
    return Array.from(userMap.values()).sort((a, b) => b.tweetCount - a.tweetCount);
  }, [tweets]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return uniqueUsers;
    const query = searchQuery.toLowerCase();
    return uniqueUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }, [uniqueUsers, searchQuery]);

  // Update local state when selectedUsers prop changes
  useEffect(() => {
    setLocalSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  const handleUserToggle = (username: string) => {
    const newSelection = localSelectedUsers.includes(username)
      ? localSelectedUsers.filter((u) => u !== username)
      : [...localSelectedUsers, username];
    
    setLocalSelectedUsers(newSelection);
  };
  const handleSelectAll = () => {
    const allUsernames = filteredUsers.map((user) => user.username);
    const combinedUsers = [...localSelectedUsers, ...allUsernames];
    const newSelection = Array.from(new Set(combinedUsers));
    setLocalSelectedUsers(newSelection);
  };

  const handleDeselectAll = () => {
    const filteredUsernames = filteredUsers.map((user) => user.username);
    const newSelection = localSelectedUsers.filter((username) => !filteredUsernames.includes(username));
    setLocalSelectedUsers(newSelection);
  };

  const handleSave = () => {
    onSelectionChange(localSelectedUsers);
    Cookies.set(COOKIE_KEY, JSON.stringify(localSelectedUsers), { expires: 30 });
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedUsers(selectedUsers);
    onClose();
  };

  const isAllFilteredSelected = filteredUsers.length > 0 && 
    filteredUsers.every((user) => localSelectedUsers.includes(user.username));

  const hasChanges = JSON.stringify(localSelectedUsers.sort()) !== JSON.stringify(selectedUsers.sort());

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleCancel}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md mx-4 bg-gray-900/95 border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bricolage font-semibold text-xl text-white">
                Filter Users
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none text-white placeholder-gray-400 transition-all duration-300 font-bricolage text-sm"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-700/30 bg-gray-800/20">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-bricolage">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                  {searchQuery && ' found'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSelectAll}
                    disabled={isAllFilteredSelected}
                    className="px-3 py-1 text-xs font-bricolage text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                  >
                    Select All
                  </button>
                  <span className="text-gray-600">•</span>
                  <button
                    onClick={handleDeselectAll}
                    className="px-3 py-1 text-xs font-bricolage text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm font-bricolage mb-1">No users found</p>
                  {searchQuery && <p className="text-gray-500 text-xs">Try adjusting your search</p>}
                </div>
              </div>
            ) : (
              <div className="p-2">
                {filteredUsers.map((user) => (
                  <UserCheckboxItem
                    key={user.username}
                    username={user.username}
                    name={user.name}
                    tweetCount={user.tweetCount}
                    isSelected={localSelectedUsers.includes(user.username)}
                    onToggle={handleUserToggle}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700/50 bg-gray-800/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-bricolage">
                {localSelectedUsers.length} user{localSelectedUsers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-400 hover:text-white font-bricolage text-sm transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-2 rounded-lg font-bricolage text-sm transition-all duration-300 ${
                    hasChanges
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!hasChanges}
                >
                  Save Filter
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
