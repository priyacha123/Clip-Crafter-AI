"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "./_components/EmptyState";
import Link from "next/link";
import { Button } from "components/ui/button";
import { VideoData } from "configs/schema";
import { useUser } from "@clerk/nextjs";
import VideoList from "./_components/VideoList";
import { db } from "configs/db";
import { eq } from "drizzle-orm";

export default function page() {
  const [videoList, setVideoList] = useState([]);

  // used to get user video
  const { user } = useUser();

  useEffect(() => {
    user && GetVideoList();
  }, [user]);

  const GetVideoList = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress));

    console.log("render result", result);
    setVideoList(result);
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
      {videoList?.length == 0 && (
        <div>
          <EmptyState />
        </div>
      )}

      {/* List of Videos */}
      <VideoList videoList={videoList} />
    </div>
  );
}
