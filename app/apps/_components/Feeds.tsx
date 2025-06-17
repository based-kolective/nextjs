"use client";

import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { UserFilterButton } from "./UserFilterButton";
import { FilterModal } from "./FilterModal";
import { LinkifiedText } from "@/utils/linkify";

interface Tweet {
  id: string;
  tweetId: string;
  bookmarkCount: number;
  conversationId: string;
  hashtags: string[];
  html: string;
  isQuoted: boolean;
  isPin: boolean;
  isReply: boolean;
  isRetweet: boolean;
  isSelfThread: boolean;
  likes: number;
  name: string;
  permanentUrl: string;
  replies: number;
  retweets: number;
  text: string;
  timeParsed: string;
  timestamp: string;
  urls: string[];
  userId: string;
  username: string;
  views: number | null;
  sensitiveContent: boolean;
  createdAt: string;
  updatedAt: string;
}

const getTweets = async () => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_AGENT_URL + "/tweets"
  );
  return response.data;
};

export const Feeds = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load selected users from cookies on mount
  useEffect(() => {
    const savedUsers = Cookies.get("feeds_selected_users");
    if (savedUsers) {
      try {
        setSelectedUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error("Error parsing saved users from cookies:", error);
      }
    }
  }, []);

  // Filter tweets based on selected users
  const filteredTweets = useMemo(() => {
    if (selectedUsers.length === 0) return tweets;
    return tweets.filter((tweet) => selectedUsers.includes(tweet.username));
  }, [tweets, selectedUsers]);
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const tweetsData = await getTweets();
        setTweets(tweetsData);
        console.log("Tweets data:", tweetsData);
      } catch (err) {
        console.error("Error fetching tweets:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  // Refresh function
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const tweetsData = await getTweets();
      setTweets(tweetsData);
      console.log("Tweets refreshed:", tweetsData);
    } catch (err) {
      console.error("Error refreshing tweets:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setRefreshing(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] p-4">
        <div className="w-full px-12 mx-auto">
          <h1 className="font-bricolage font-semibold text-xl text-white mb-2">
            Twitter Feed Dashboard
          </h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-transparent border-t-blue-500 border-r-purple-500 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400 text-sm font-bricolage">
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] p-4">
        <div className="w-full px-12 mx-auto">
          <h1 className="font-bricolage font-semibold text-xl text-white mb-2">
            Twitter Feed Dashboard
          </h1>
          <div className="bg-[#1a1a1a] border border-gray-800/50 rounded-lg p-6">
            <p className="text-red-300 text-sm mb-4">
              Error loading dashboard: {error.message}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-300 font-bricolage text-sm rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] p-4">
      <div className="w-full px-12 mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-bricolage font-semibold text-xl text-white mb-1">
              Twitter Feed Dashboard
            </h1>
            <p className="text-gray-400 text-sm font-bricolage">
              Monitor crypto insights and market discussions
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <UserFilterButton
              selectedCount={selectedUsers.length}
              onClick={() => setIsModalOpen(true)}
            />

            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-3 py-2 bg-[#1a1a1a] border border-gray-700/50 hover:border-gray-600/50 disabled:opacity-50 text-white font-bricolage text-sm rounded-lg transition-all duration-300"
            >
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 1,
                  repeat: refreshing ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </motion.svg>
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </motion.button>
          </div>
        </div>
        {/* Dashboard Layout */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
          {" "}
          {/* Left Sidebar - Stats & Info */}
          <div className="col-span-3 space-y-4">
            {/* Tweet Stats Card */}
            <div className="bg-[#1a1a1a] border border-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-bricolage font-semibold text-sm mb-3">
                Feed Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs font-bricolage">
                    Total Tweets
                  </span>
                  <span className="text-white text-sm font-bricolage font-semibold">
                    {tweets.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs font-bricolage">
                    Filtered
                  </span>
                  <span className="text-white text-sm font-bricolage font-semibold">
                    {filteredTweets.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs font-bricolage">
                    Selected Users
                  </span>
                  <span className="text-blue-400 text-sm font-bricolage font-semibold">
                    {selectedUsers.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {selectedUsers.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-bricolage font-semibold text-sm mb-3">
                  Active Filters
                </h3>
                <div className="space-y-2">
                  {selectedUsers.map((username) => {
                    const user = tweets.find((t) => t.username === username);
                    return user ? (
                      <motion.div
                        key={username}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-between px-2 py-1 bg-blue-600/10 border border-blue-500/20 rounded text-blue-300 text-xs font-bricolage"
                      >
                        <span>@{username}</span>
                        <button
                          onClick={() => {
                            const newSelection = selectedUsers.filter(
                              (u) => u !== username
                            );
                            setSelectedUsers(newSelection);
                            Cookies.set(
                              "feeds_selected_users",
                              JSON.stringify(newSelection),
                              { expires: 30 }
                            );
                          }}
                          className="hover:text-red-400 transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </motion.div>
                    ) : null;
                  })}
                  {selectedUsers.length > 1 && (
                    <button
                      onClick={() => {
                        setSelectedUsers([]);
                        Cookies.remove("feeds_selected_users");
                      }}
                      className="w-full text-center py-1 text-gray-400 hover:text-red-400 text-xs font-bricolage transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-[#1a1a1a] border border-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-bricolage font-semibold text-sm mb-3">
                Recent Activity
              </h3>
              <div className="space-y-2">
                {filteredTweets.slice(0, 3).map((tweet) => (
                  <div
                    key={tweet.id}
                    className="flex items-center space-x-2 text-xs"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 font-bricolage truncate">
                      @{tweet.username}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 font-bricolage">
                      {new Date(tweet.timeParsed).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Main Feed Panel */}
          <div className="col-span-9">
            <div className="bg-[#1a1a1a] border border-gray-800/50 rounded-lg overflow-hidden h-full">
              {/* Feed Header */}
              <div className="border-b border-gray-800/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bricolage font-semibold text-sm">
                    Live Feed
                  </h2>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 font-bricolage">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Real-time updates</span>
                  </div>
                </div>
              </div>

              {/* Feed Content */}
              <div className="h-[calc(100%-60px)] overflow-y-auto">
                {filteredTweets.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <svg
                          className="mx-auto h-12 w-12 text-gray-600 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"
                          />
                        </svg>
                        <p className="text-sm font-bricolage mb-1">
                          No tweets found
                        </p>
                        {selectedUsers.length > 0 && (
                          <p className="text-gray-500 text-xs">
                            Try adjusting your filters
                          </p>
                        )}
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {filteredTweets.map((tweet, index) => (
                      <motion.div
                        key={tweet.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="border-b border-gray-800/30 p-4 hover:bg-gray-900/30 transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm font-bricolage">
                              {tweet.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-bricolage font-semibold text-white text-sm">
                                {tweet.name}
                              </h3>
                              <span className="text-gray-400 text-xs font-bricolage">
                                @{tweet.username}
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-400 text-xs font-bricolage">
                                {new Date(tweet.timeParsed).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {tweet.isRetweet && (
                                <span className="bg-green-600/20 text-green-300 text-xs px-2 py-0.5 rounded-full font-medium font-bricolage">
                                  RT
                                </span>
                              )}
                              {tweet.isPin && (
                                <span className="bg-yellow-600/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full font-medium font-bricolage">
                                  Pinned
                                </span>
                              )}
                            </div>
                            <p className="text-gray-200 mb-3 whitespace-pre-wrap leading-relaxed text-sm font-bricolage">
                              {/* This will render the tweet text with links and cashtags */}
                              <LinkifiedText text={tweet.text} />
                            </p>

                            {/* Tweet Actions */}
                            <div className="flex items-center space-x-4 text-gray-400 text-xs">
                              <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer group">
                                <svg
                                  className="w-3 h-3 group-hover:scale-110 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                                <span className="font-bricolage">
                                  {tweet.replies}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 hover:text-green-400 transition-colors cursor-pointer group">
                                <svg
                                  className="w-3 h-3 group-hover:scale-110 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                                <span className="font-bricolage">
                                  {tweet.retweets}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 hover:text-red-400 transition-colors cursor-pointer group">
                                <svg
                                  className="w-3 h-3 group-hover:scale-110 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                <span className="font-bricolage">
                                  {tweet.likes}
                                </span>
                              </div>
                              {tweet.views !== null && (
                                <div className="flex items-center space-x-1 hover:text-purple-400 transition-colors cursor-pointer group">
                                  <svg
                                    className="w-3 h-3 group-hover:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  <span className="font-bricolage">
                                    {tweet.views.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              <a
                                href={tweet.permanentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors group font-bricolage ml-auto"
                              >
                                <span>View</span>
                                <svg
                                  className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Filter Modal */}
        <FilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tweets={tweets}
          selectedUsers={selectedUsers}
          onSelectionChange={(newSelection) => {
            setSelectedUsers(newSelection);
            Cookies.set("feeds_selected_users", JSON.stringify(newSelection), {
              expires: 30,
            });
          }}
        />
      </div>
    </div>
  );
};

export default Feeds;
