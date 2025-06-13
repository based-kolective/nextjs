"use client";

import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { UserFilterButton } from "./UserFilterButton";
import { FilterModal } from "./FilterModal";

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
  };  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bricolage font-semibold text-2xl text-white mb-2">
            Feeds
          </h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-transparent border-t-blue-500 border-r-purple-500 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400 text-sm font-bricolage">Loading feeds...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bricolage font-semibold text-2xl text-white mb-2">
            Feeds
          </h1>
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/30 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-red-300 text-sm mb-4">Error loading feeds: {error.message}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bricolage text-sm rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="font-bricolage font-semibold text-2xl text-white mb-1">
              Feeds
            </h1>
            <p className="text-gray-400 text-sm font-bricolage">
              Latest insights from crypto leaders
            </p>
          </div>
          
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-bricolage text-sm rounded-lg transition-all duration-300"
          >
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </motion.button>
        </div>          {/* Filter Section */}
        <div className="mb-6">
          <UserFilterButton
            selectedCount={selectedUsers.length}
            onClick={() => setIsModalOpen(true)}
          />
          {selectedUsers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex flex-wrap gap-2"
            >
              {selectedUsers.map((username) => {
                const user = tweets.find(t => t.username === username);
                return user ? (
                  <motion.span
                    key={username}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-bricolage"
                  >
                    <span>@{username}</span>
                    <button
                      onClick={() => {
                        const newSelection = selectedUsers.filter(u => u !== username);
                        setSelectedUsers(newSelection);
                        Cookies.set("feeds_selected_users", JSON.stringify(newSelection), { expires: 30 });
                      }}
                      className="hover:text-red-400 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.span>
                ) : null;
              })}
              {selectedUsers.length > 1 && (
                <button
                  onClick={() => {
                    setSelectedUsers([]);
                    Cookies.remove("feeds_selected_users");
                  }}
                  className="inline-flex items-center px-3 py-1 text-gray-400 hover:text-red-400 text-xs font-bricolage transition-colors"
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-gray-400 font-bricolage"
          >
            {selectedUsers.length === 0 
              ? `Showing all ${tweets.length} tweets`
              : `Showing ${filteredTweets.length} tweet${filteredTweets.length !== 1 ? 's' : ''} from ${selectedUsers.length} selected user${selectedUsers.length !== 1 ? 's' : ''}`
            }
          </motion.p>
        </div>{/* Feeds Panel */}
        <div className="bg-gray-900/30 border border-gray-700/30 rounded-2xl backdrop-blur-sm overflow-hidden">
          <div className="h-[700px] overflow-y-auto">
            {filteredTweets.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                    </svg>                    <p className="text-sm font-bricolage mb-1">No tweets found</p>
                    {selectedUsers.length > 0 && <p className="text-gray-500 text-xs">Try adjusting your filter</p>}
                  </motion.div>
                </div>
              </div>            ) : (
              <div className="space-y-0">
                {filteredTweets.map((tweet, index) => (
                  <motion.div 
                    key={tweet.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-700/30 p-6 hover:bg-gray-800/20 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg font-bricolage">
                          {tweet.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bricolage font-semibold text-white text-base">{tweet.name}</h3>
                          <span className="text-gray-400 text-sm font-bricolage">@{tweet.username}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400 text-xs font-bricolage">
                            {new Date(tweet.timeParsed).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {tweet.isRetweet && (
                            <span className="bg-gradient-to-r from-green-600 to-green-500 text-green-100 text-xs px-2 py-1 rounded-full font-medium font-bricolage">
                              RT
                            </span>
                          )}
                          {tweet.isPin && (
                            <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-100 text-xs px-2 py-1 rounded-full font-medium font-bricolage">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed text-sm font-bricolage">{tweet.text}</p>
                          {/* Tweet Statistics */}
                        <div className="flex items-center space-x-6 text-gray-400 text-xs mb-4">
                          <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer group">
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-bricolage text-xs">{tweet.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1 hover:text-green-400 transition-colors cursor-pointer group">
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="font-bricolage text-xs">{tweet.retweets}</span>
                          </div>
                          <div className="flex items-center space-x-1 hover:text-red-400 transition-colors cursor-pointer group">
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-bricolage text-xs">{tweet.likes}</span>
                          </div>
                          {tweet.views !== null && (
                            <div className="flex items-center space-x-1 hover:text-purple-400 transition-colors cursor-pointer group">
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span className="font-bricolage text-xs">{tweet.views.toLocaleString()}</span>
                            </div>
                          )}
                        </div>                        {/* Hashtags */}
                        {tweet.hashtags.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1">
                            {tweet.hashtags.map((hashtag, index) => (
                              <span key={index} className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-bricolage text-xs">
                                #{hashtag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* External Link */}
                        <a
                          href={tweet.permanentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group font-bricolage text-xs"
                        >
                          <span>View on Twitter</span>
                          <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>        </div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tweets={tweets}
          selectedUsers={selectedUsers}
          onSelectionChange={(newSelection) => {
            setSelectedUsers(newSelection);
            Cookies.set("feeds_selected_users", JSON.stringify(newSelection), { expires: 30 });
          }}
        />
      </div>
    </div>
  );
};

export default Feeds;
