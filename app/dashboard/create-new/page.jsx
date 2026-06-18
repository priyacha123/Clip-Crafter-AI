"use client";

import { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import CustomeLoading from "./_components/CustomeLoading";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import PlayerDialog from "../_components/PlayerDialog";
import { VideoDataContext } from "app/_context/VideoDataContext";
import SelectVoice from "./_components/SelectVoice";
import ImageReferenceUpload from "./_components/ImageReferenceUpload";

const USER_EMAIL_STORAGE_KEY = "clipcrafter:userEmail";

const CreateNew = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();
  const [referenceImages, setReferenceImages] = useState([]);

  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const onhandleInputChange = (fieldName, fieldValue) => {
    console.log("fieldName, fieldValue", fieldName, fieldValue);
    // console.log("DRIZZLE_DATABASE_URL:", process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL);

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
    const topicPrompt = formData?.topic?.trim();
    const missingFields = [];

    if (!topicPrompt) missingFields.push("content");
    if (!formData?.imageStyle) missingFields.push("style");
    if (!formData?.voiceStyle) missingFields.push("voice");
    if (!formData?.duration) missingFields.push("duration");

    if (missingFields.length > 0) {
      alert(`Please select: ${missingFields.join(", ")}.`);
      setLoading(false);
      return;
    }
    const prompt = `
You are an API that returns ONLY valid JSON.

Generate a script for a ${formData.duration} video on the topic "${topicPrompt}"
using a ${formData.voiceStyle} narration style.

Return the response as a JSON ARRAY only.
Each array item must be an object with EXACTLY these two fields:
- "ImagePrompt": string
- "ContextField": string

DO NOT:
- include markdown
- include code blocks
- include explanations
- include comments
- include extra fields
- wrap the array in an object

The response MUST start with [ and end with ].

Use "${formData.imageStyle}" style for all image prompts.

Return ONLY the JSON array and nothing else.
`;

    console.log("prompt", prompt);

    try {
      const resp = await axios.post("/api/get-video-script", {
        prompt,
      });
      console.log("resp.data.result", resp.data.result);
      console.log("TYPE:", typeof resp.data.result);
      console.log("IS ARRAY:", Array.isArray(resp.data.result));

      if (resp.data.result) {
        setVideoData((prev) => ({
          ...prev,
          videoScript: resp.data.result,
        }));
        setVideoScript(resp.data.result);
        await GenerateAudioFile(resp.data.result);
        console.log("videoScriptData Generate Image:", resp.data.result);
        await GenerateImage(resp.data.result);
      }
    } catch (error) {
      console.error("Failed to generate video script:", error);
      const errorMessage =
        error?.response?.data?.error ||
        "Video script generation failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // get audio file
  const GenerateAudioFile = async (videoScriptData, voiceStyle = "Female") => {
    console.log("audio step 1");
    // Combine all ContextFields into a single script
    const script = videoScriptData.map((item) => item.ContextField).join(" ");
    const id = uuidv4();
    const BASE_URL = "https://aigurulab.tech";

    console.log("Final Script:", script);

    // const result = await axios.post(BASE_URL+'/api/text-to-speech',
    //       {
    //           input: 'Sample Audio Text',
    //           voice: 'am_michael'
    //       },
    //       {
    //           headers: {
    //               'x-api-key': apiKey, // Your API Key
    //               'Content-Type': 'application/json', // Content Type
    //           },
    //       })
    //    console.log(result.data.audio) //Output Result: Audio Mp3 Url

    try {
      const resp = await axios.post("/api/generate-audio", {
        text: script,
        id: uuidv4(),
        voiceStyle: "am_michael", // optional, maps to Speechify voice
      });

      if (!resp.data.result) {
        console.error("No audio URL returned");
        return;
      }
      console.log("Audio URL:", resp.data.result);
      // Update state with audio file URL
      setVideoData((prev) => ({
        ...prev,
        audioFileUrl: resp.data.result,
      }));
      setAudioFileUrl(resp.data.result);

      // Generate captions if needed
      await GenerateAudioCaption(resp.data.result, script);

      console.log("audio step 3");
    } catch (err) {
      console.error("Error generating audio:", err);
    }
  };

  //  get caption file
  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    // setLoading(true);
    console.log("fileUrl", fileUrl);

    const resp = await axios.post("/api/generate-caption", {
      audioFileUrl: fileUrl,
    });
    setCaptions(resp?.data?.result);
    setVideoData((prev) => ({
      ...prev,
      captions: resp.data.result,
    }));
    console.log("GenerateAudioCaption", resp.data.result);
    // console.log("videoScriptData Generate Image Caption:",resp.data.result);

    // setLoading(false);
  };

  // get AI image
  const GenerateImage = async (videoScriptData) => {
    setLoading(true);

    let images = [];

    for (const element of videoScriptData) {
      try {
        const resp = await axios.post("/api/generate-image", {
          prompt: element.ImagePrompt,
          referenceImages,
        });

        // ✅ FIX HERE
        console.log("GenerateImage", resp.data.image);

        images.push(resp.data.image); // base64 image
      } catch (e) {
        console.log("error generate image", e);
      }
    }

    setVideoData((prev) => ({
      ...prev,
      imageList: images,
    }));

    setImageList(images);
    setLoading(false);
  };

  useEffect(() => {
    console.log("videoData", videoData);

    if (
      videoData &&
      Object.keys(videoData).length === 4 &&
      user?.primaryEmailAddress?.emailAddress
    ) {
      SaveVideoData(videoData);
    }
  }, [videoData, user]);

  const SaveVideoData = async (videoData) => {
    setLoading(true);
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      console.error("Cannot save video without a signed-in user email.");
      setLoading(false);
      return;
    }

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_EMAIL_STORAGE_KEY, email.toLowerCase());
      }

      const response = await axios.post("/api/videos", {
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: email,
      });

      setVideoId(response.data.id);
      setPlayVideo(true);

      console.log("SaveVideoData", response.data);
    } catch (error) {
      console.error("Failed to save video", error);
    } finally {
      setLoading(false);
    }
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
        <SelectVoice onUserSelect={onhandleInputChange} />
        <SelectDuration onUserSelect={onhandleInputChange} />
        <ImageReferenceUpload
          value={referenceImages}
          onChange={setReferenceImages}
        />

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
