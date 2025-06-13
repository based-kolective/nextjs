"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const getTweets = async () => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_AGENT_URL + "/tweets"
  );
  return response.data;
};

export const Feeds = () => {
  const [tweets, setTweets] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  useEffect(() => {}, [tweets, loading, error]);

  if (loading) {
    return (
      <div>
        <h2>Feeds</h2>
        <p>Loading tweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Feeds</h2>
        <p>Error loading tweets: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Feeds</h2>
      <p>Tweets loaded successfully! Check console for data.</p>
    </div>
  );
};

export default Feeds;
