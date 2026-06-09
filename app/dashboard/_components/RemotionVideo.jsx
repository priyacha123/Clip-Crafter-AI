"use client";

import React, { useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const DEFAULT_COVER_IMAGE = staticFile("default_cover.jpg");

const RemotionVideo = ({
  script,
  imageList,
  audioFileUrl,
  captions,
  setDurationInFrame,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Safely coerce captions to an array
  const safeCaptions = useMemo(() => {
    if (!captions) return [];
    if (Array.isArray(captions)) return captions;
    if (typeof captions === "string") {
      try {
        const parsed = JSON.parse(captions);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [captions]);

  // Safely coerce imageList to an array
  const safeImageList = useMemo(() => {
    if (!imageList) return [];
    if (Array.isArray(imageList)) return imageList;
    if (typeof imageList === "string") {
      try {
        const parsed = JSON.parse(imageList);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [imageList]);

  // Use the cover image as fallback when no images exist
  const images =
    safeImageList.length > 0 ? safeImageList : [DEFAULT_COVER_IMAGE];

  const totalDuration = useMemo(() => {
    if (safeCaptions.length === 0) return 100;
    const lastEnd = safeCaptions[safeCaptions.length - 1]?.end;
    if (typeof lastEnd !== "number" || !isFinite(lastEnd)) return 100;
    return Math.max(1, Math.ceil((lastEnd / 1000) * fps));
  }, [fps, safeCaptions]);

  // Notify the parent of the calculated duration — inside useEffect,
  // NOT during render (which causes a React warning).
  useEffect(() => {
    if (setDurationInFrame) {
      setDurationInFrame(totalDuration);
    }
  }, [setDurationInFrame, totalDuration]);

  const getCurrentCaptions = () => {
    if (safeCaptions.length === 0) return "";
    const currentTime = (frame / fps) * 1000;
    const word = safeCaptions.find(
      (w) => w && currentTime >= w.start && currentTime <= w.end
    );
    return word ? word.text : "";
  };

  if (!script) return null;

  return (
    <AbsoluteFill className="bg-black">
      {images.map((item, index) => {
        const segmentDuration = Math.max(
          1,
          Math.ceil(totalDuration / images.length)
        );
        const startTime = index * segmentDuration;

        const scaleValue = interpolate(
          frame,
          [startTime, startTime + segmentDuration / 2, startTime + segmentDuration],
          index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <Sequence
            key={index}
            from={startTime}
            durationInFrames={segmentDuration}
          >
            <AbsoluteFill
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Img
                src={item}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scaleValue})`,
                }}
              />
              <AbsoluteFill
                style={{
                  color: "white",
                  justifyContent: "center",
                  top: undefined,
                  bottom: 5,
                  height: 150,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <h2 className="text-2xl bg-white font-bold text-black">
                  {getCurrentCaptions()}
                </h2>
              </AbsoluteFill>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {audioFileUrl && <Audio src={audioFileUrl} />}
    </AbsoluteFill>
  );
};

export default RemotionVideo;
