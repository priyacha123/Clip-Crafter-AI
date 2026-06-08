"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "./_components/EmptyState";
import Link from "next/link";
import { Button } from "components/ui/button";
import { useUser } from "@clerk/nextjs";
import VideoList from "./_components/VideoList";

export default function page() {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user?.primaryEmailAddress?.emailAddress) {
      setVideoList([]);
      setIsLoading(false);
      return;
    }

    GetVideoList(user.primaryEmailAddress.emailAddress);
  }, [isLoaded, user]);

  const GetVideoList = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/videos?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load videos", data);
        setVideoList([]);
        return;
      }

      console.log("render result", data.videos);
      setVideoList(data.videos || []);
    } catch (error) {
      console.error("Failed to load videos", error);
      setVideoList([]);
    } finally {
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
 
