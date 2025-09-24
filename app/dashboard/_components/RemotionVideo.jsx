import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

const RemotionVideo = ({
  script,
  imageList,
  audioFileurl,
  captions,
  setDurationInFrame,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const getDurationFrame = () => {
    setDurationInFrame((captions[captions?.length - 1]?.end / 1000) * fps);
    return (captions[captions?.length - 1]?.end / 1000) * fps;
  };

  const getCurrentCaptions = () => {
    const currentTime = frame/30*1000 //Convert frame number to milliseconds
    const currentCaption = captions.find((word) => currentTime >= word.start && currentTime <= word.end) 
    return currentCaption?currentCaption?.text:"";
  }

  return (
    <AbsoluteFill className="bg-black">
      {imageList?.map((item, index) => (
        <>
          <Sequence
            key={index}
            from={(index * getDurationFrame()) / imageList?.length}
            durationInFrames={getDurationFrame}
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
                }}
              />
              <AbsoluteFill style={{
                color:'white',
                justifyContent:'center',
                top:undefined,
                bottom:50,
                height:150,
                textAlign:'center',
                width:'100%'
              }}>
                <h2 className="text-2xl">
                  {getCurrentCaptions()}
                </h2>
              </AbsoluteFill>
            </AbsoluteFill>
          </Sequence>
        </>
      ))}

      <Audio src={audioFileurl} />
    </AbsoluteFill>
  );
};

export default RemotionVideo;
