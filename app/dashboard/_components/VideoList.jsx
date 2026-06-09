import React, { useState } from "react";
import PlayerDialog from "./PlayerDialog";

const VideoList = ({ videoList }) => {
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoId, setVideoId] = useState();

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
      {videoList?.map((video, index) => (
        <div
          key={index}
          className="cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:scale-105 dark:bg-black"
          onClick={() => {
            setOpenPlayDialog(Date.now());
            setVideoId(video?.id);
          }}
        >
          <img
            src="/default_cover.jpg"
            alt="Video cover"
            className="h-[350px] w-full object-cover"
          />
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-semibold">
              Generated short video
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {video?.createdAt
                ? new Date(video.createdAt).toLocaleString()
                : "Recently created"}
            </p>
          </div>
        </div>
      ))}
      <PlayerDialog playVideo={openPlayDialog} videoId={videoId} />
    </div>
  );
};

export default VideoList;
