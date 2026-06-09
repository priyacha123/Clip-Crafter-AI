"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "./_components/EmptyState";
import Link from "next/link";
import { Button } from "components/ui/button";
import { useUser } from "@clerk/nextjs";
import VideoList from "./_components/VideoList";

const USER_EMAIL_STORAGE_KEY = "clipcrafter:userEmail";

export default function page() {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storedEmail, setStoredEmail] = useState(null);
  const [fetchError, setFetchError] = useState("");

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (typeof window === "undefined") return;

    setStoredEmail(localStorage.getItem(USER_EMAIL_STORAGE_KEY) || "");
  }, []);

  useEffect(() => {
    if (storedEmail === null) return;

    const resolvedEmail =
      user?.primaryEmailAddress?.emailAddress || storedEmail || "";

    if (!resolvedEmail) {
      setVideoList([]);
      setFetchError("We could not resolve your signed-in email yet.");
      setIsLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(USER_EMAIL_STORAGE_KEY, resolvedEmail);
    }

    GetVideoList(resolvedEmail);
  }, [isLoaded, storedEmail, user]);

  const GetVideoList = async (email) => {
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      setFetchError("");
      const response = await fetch(
        `/api/videos?email=${encodeURIComponent(email)}&summary=1`,
        { signal: controller.signal }
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load videos", data);
        setVideoList([]);
        setFetchError(data.error || "Failed to load your videos.");
        return;
      }

      console.log("render result", data.videos);
      setVideoList(data.videos || []);
    } catch (error) {
      console.error("Failed to load videos", error);
      setVideoList([]);
      setFetchError(
        error?.name === "AbortError"
          ? "Loading your videos took too long. Please try again."
          : "Could not reach the video API."
      );
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Link href={"/dashboard/create-new"}>
          <Button>Create New</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-10 rounded-lg border p-6 text-sm text-muted-foreground">
          Loading your videos...
        </div>
      ) : null}

      {!isLoading && fetchError ? (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          {fetchError}
        </div>
      ) : null}

      {/* Empty state */}
      {!isLoading && videoList?.length == 0 && (
        <div>
          <EmptyState />
        </div>
      )}

      {/* List of Videos */}
      {!isLoading && <VideoList videoList={videoList} />}
    </div>
  );
}
 
