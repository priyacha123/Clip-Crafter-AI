"use client";

import { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../@/components/ui/button";
import axios from "axios";
import CustomeLoading from "./_components/CustomeLoading";
import { v4 as uuidv4 } from "uuid";
import { VideoData } from "configs/schema";
import { useUser } from "@clerk/nextjs";
import PlayerDialog from "../_components/PlayerDialog";
import { VideoDataContext } from "app/_context/VideoDataContext";

// const scriptdata = " In a room bathed in moonlight, a little boy named Leo snuggled deep into his covers, ready for a story. His father opened a book of magical tales. 'Tonight,' he whispered, 'we'll meet a brave little dragon.' Deep in an enchanted forest, a tiny dragon named Sparky hatched from a shimmering egg. But Sparky was all alone and couldn't find his family. He let out a tiny, whimpering puff of smoke. Leo listened, his heart aching for the little dragon. 'He needs help,' he thought. Just then, a tiny light flickered in the darkness. It was a brave firefly named Flicker! 'This way!' buzzed Flicker, leading Sparky through the Whispering Woods. Flicker led him to a crystal cave, where Sparky’s family was waiting with open wings! With Sparky safe, Dad closed the book. Leo smiled, feeling warm and ready for sleep. And as he drifted off, he dreamed of soaring through the night sky with his new dragon friend. The End. "

// const FILEURL='https://firebasestorage.googleapis.com/v0/b/intense-howl-472504-b2.firebasestorage.app/o/ai-short-video-files%2Fe99ce48d-eee7-46bd-b156-3563c2e1625a.mp3?alt=media&token=bcb1889d-e6a0-41f5-ab8f-20f895eb09a7'

// const VIDEOSCRIPT = [
//   {
//     "ImagePrompt": "Daguerreotype photograph, 1932, Australian soldiers in full military gear, comically chasing a flock of large emus across a vast, dusty wheat field, grainy, sepia-toned, authentic historical photo style.",
//     "ContextField": "In 1932, the Australian military was deployed to combat an overpopulation of emus, a conflict they ultimately lost. This event is famously known as 'The Great Emu War'."
//   },
// ]
const CreateNew = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState(true)
  const [videoId, setVideoId] = useState(1)


  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const onhandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    GetVideoScript();
    // GenerateAudioFile(scriptdata)
    // GenerateAudioCaption(FILEURL)
    // GenerateImage()
  };

  // get video script
  const GetVideoScript = async () => {
    setLoading(true);
    const prompt =
      "Write a script to generate " +
      formData.duration +
      " video on topic: " +
      formData.topic +
      " along with AI Images prompt in " +
      formData.imageStyle +
      " format for each scene(there should be atleast 5 scene) and give me the result in JSON format with ImagePrompt and ContextField as field. No Plain Text. Do not include a title, duration, or any other fields.Do not add explanations before or after the JSON. Return only the JSON array.Respond ONLY with valid JSON, no markdown, no code blocks, no extra commentary. ";

    console.log(prompt);

    const resp = await axios.post("/api/get-video-script", {
      prompt: prompt,
    });
    console.log("resp.data", resp.data.result);
    console.log("TYPE:", typeof resp.data.result);
    console.log("IS ARRAY:", Array.isArray(resp.data.result));

    if (resp.data.result) {
      setVideoData((prev) => ({
        ...prev,
        "videoScript": resp.data.result,
      }));
      setVideoScript(resp.data.result);
      GenerateAudioFile(resp.data.result);
      await GenerateAudioFile(resp.data.result);
    }
    // setLoading(false);
  };
  // get audio file
  const GenerateAudioFile = async (videoScriptData) => {
    // setLoading(true);

    let script = "";
    const id = uuidv4();
    videoScriptData.forEach((item) => {
      script = script + item.ContextField + " ";
    });

    console.log("videoScriptData", script);

    const resp = await axios.post("/api/generate-audio", {
      text: videoScriptData,
      id: id,
    });
    setVideoData((prev) => ({
      ...prev,
      "audioFileUrl": resp.data.result,
    }));
    console.log("GenerateAudioFile", resp.data);
    setAudioFileUrl(resp.data.result);
    resp.data.result && GenerateAudioCaption(resp.data.result, videoScriptData);

    setLoading(false);
  };

  //  get caption file
  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    // setLoading(true);

    const resp = await axios.post("/api/generate-caption", {
      audioFileUrl: fileUrl,
    });
    setVideoData((prev) => ({
      ...prev,
      "captions": resp.data.result,
    }));
    console.log("GenerateAudioCaption", resp.data.result);
    setCaptions(resp?.data?.result);
    resp.data.result && GenerateImage(videoScriptData);

    setLoading(false);
  };

  // get AI image
  const GenerateImage = async (videoScriptData) => {
    let images = [];
    for (const element of videoScriptData) {
      try {
        const resp = await axios.post("/api/generate-image", {
          prompt: element.ImagePrompt,
        });
        console.log(resp.data.result);
        images.push(resp.data.result);
      } catch (e) {
        console.log("error generate image", e);
      }
    }
    setVideoData((prev) => ({
      ...prev,
      "imageList": images,
    }));

    setImageList(images);
    setLoading(false);

    useEffect(() => {
      console.log(videoData);
      if (Object.keys(videoData).length == 4) {
        SaveVideoData(videoData);
      }
    }, [videoData]);

    const SaveVideoData = async (videoData) => {
      setLoading(true);

      const result = await db
        .insert(VideoData)
        .values({
          script: VideoData?.videoScript,
          audioFileUrl: VideoData?.audioFileUrl,
          captions: videoData?.captions,
          imageList: videoData?.imageList,
          createdBy: User?.primaryEmailAddress.emailAddress,
        }).returning({ id: VideoData?.id });

        setVideoId(result[0].id);
        setPlayVideo(true)

      console.log("SaveVideoData", result);
      setLoading(false);
    };

    // try {
    //   setLoading(true);

    //   const images = await Promise.all(
    //     videoScriptData.map(async (element) => {
    //       try {
    //         const response = await axios.post("/api/generate-image", {
    //           prompt: element.ImagePrompt,
    //         });
    //         return response.data.result; // this is a base64 image
    //       } catch (err) {
    //         console.error(" Error generating image:", err.message);
    //         return null;
    //       }
    //     })
    //   );
    // setVideoData((prev) => ({
    //   ...prev,
    //   "imageList": resp.data.result,
    // }));

    //   setImageList(images.filter(Boolean));
    //   console.log("All Files:", images, videoScript, audioFileUrl, captions);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <div className="md:px-20">
        <h2 className="font-bold text-4xl text-primary text-center">
          Create New
        </h2>
      </div>

      <div className=" shadow-md">
        <SelectTopic onUserSelect={onhandleInputChange} />
        <SelectStyle onUserSelect={onhandleInputChange} />
        <SelectDuration onUserSelect={onhandleInputChange} />

        <div className="m-10 p-10 mt-0 pt-0 flex justify-center items-center">
          <Button className="w-full" onClick={onCreateClickHandler}>
            {" "}
            Create Short Video{" "}
          </Button>
        </div>
      </div>
      <CustomeLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </>
  );
};

export default CreateNew;
