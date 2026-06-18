import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";

const PlayerDialog = ({ playVideo, videoId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const [isRendering, setIsRendering] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (playVideo) {
      setOpenDialog(true);
      videoId && GetVideoData();
    } else {
      setOpenDialog(false);
    }
  }, [playVideo]);

  const GetVideoData = async () => {
    const response = await fetch(`/api/videos/${videoId}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to load video", data);
      return;
    }

    console.log("GetVideoData", data.video);
    const video = data.video;
    if (!video) return;

    setVideoData(video);

    // Calculate duration from captions
    const caps = Array.isArray(video.captions) ? video.captions : [];
    if (caps.length > 0) {
      const lastEnd = caps[caps.length - 1]?.end;
      if (typeof lastEnd === "number" && isFinite(lastEnd)) {
        setDurationInFrame(Math.ceil((lastEnd / 1000) * 30));
      }
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    router.replace("/dashboard");
  };

  const handleDownload = async () => {
    if (!videoId || isRendering) return;
    setIsRendering(true);
    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = await response.json();
      if (data.success && data.downloadUrl) {
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = `short-video-${videoId}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Failed to render video: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("An error occurred during video rendering.");
    } finally {
      setIsRendering(false);
    }
  };

  const coverImage = (() => {
    const rawImageList = videoData?.imageList;

    if (Array.isArray(rawImageList) && rawImageList[0]) {
      return rawImageList[0];
    }

    if (typeof rawImageList === "string") {
      try {
        const parsed = JSON.parse(rawImageList);
        if (Array.isArray(parsed) && parsed[0]) {
          return parsed[0];
        }
      } catch {
        // Fall back to the default cover image below.
      }
    }

    return "/default_cover.jpg";
  })();

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5">
            Your video is ready!!
          </DialogTitle>
          <DialogDescription>
            <Player
              component={RemotionVideo}
              durationInFrames={Number(durationInFrame.toFixed(0))}
              compositionWidth={300}
              compositionHeight={450}
              fps={30}
              controls={true}
              showPosterWhenUnplayed={true}
              renderPoster={() => (
                <img
                  src={coverImage}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  alt="Video Cover"
                />
              )}
              inputProps={{
                ...videoData,
                setDurationInFrame: (frameValue) =>
                  setDurationInFrame(frameValue),
              }}
            />
            <div className="flex justify-center mt-3 items-center gap-4">
              <Button
                disabled={isRendering}
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                {isRendering ? "Rendering..." : "Download"}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
