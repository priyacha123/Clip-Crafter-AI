"use client";

import { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import CustomeLoading from "./_components/CustomeLoading";
import { v4 as uuidv4 } from "uuid";
import { VideoData } from "configs/schema";
import { useUser } from "@clerk/nextjs";
import PlayerDialog from "../_components/PlayerDialog";
import { VideoDataContext } from "app/_context/VideoDataContext";
import { db } from "configs/db";
import SelectVoice from "./_components/SelectVoice";

// const scriptdata = " In a room bathed in moonlight, a little boy named Leo snuggled deep into his covers, ready for a story. His father opened a book of magical tales. 'Tonight,' he whispered, 'we'll meet a brave little dragon.' Deep in an enchanted forest, a tiny dragon named Sparky hatched from a shimmering egg. But Sparky was all alone and couldn't find his family. He let out a tiny, whimpering puff of smoke. Leo listened, his heart aching for the little dragon. 'He needs help,' he thought. Just then, a tiny light flickered in the darkness. It was a brave firefly named Flicker! 'This way!' buzzed Flicker, leading Sparky through the Whispering Woods. Flicker led him to a crystal cave, where Sparky’s family was waiting with open wings! With Sparky safe, Dad closed the book. Leo smiled, feeling warm and ready for sleep. And as he drifted off, he dreamed of soaring through the night sky with his new dragon friend. The End. "

// const FILEURL='https://firebasestorage.googleapis.com/v0/b/intense-howl-472504-b2.firebasestorage.app/o/ai-short-video-files%2Fe99ce48d-eee7-46bd-b156-3563c2e1625a.mp3?alt=media&token=bcb1889d-e6a0-41f5-ab8f-20f895eb09a7'

const VIDEOSCRIPT = [
{
"ImagePrompt": "2D cartoon style, gloomy bedroom at night, moonlight streaming through window, shadows stretching across the floor, a slightly ajar closet door in the background, dark blue and purple color palette, eerie atmosphere",
"ContextField": "They say you should never look under your bed after midnight. But nobody ever warned me about the closet."
},
{
"ImagePrompt": "2D cartoon style, close up of a wooden closet door, texture detail, sharp claw marks appearing from the inside, low angle shot, suspenseful lighting, dark shadows",
"ContextField": "It started as a scratch. A slow, rhythmic sound against the wood. Skritch. Skritch. Skritch."
},
{
"ImagePrompt": "2D cartoon style, frightened person hiding under blanket, only eyes visible, wide terrified eyes, dark room, silhouette of the closet in the distance, comic book shading",
"ContextField": "I pulled the covers up, praying it was just the house settling. Then, a voice whispered my name... from the inside."
},
{
"ImagePrompt": "2D cartoon style, first person perspective reaching for a brass doorknob, trembling hand, dark surroundings, cinematic lighting, spooky cartoon aesthetic",
"ContextField": "I couldn't help it. I walked toward the door, my hand trembling as I reached for the cold brass handle."
},
{
"ImagePrompt": "2D cartoon style, open empty closet, darkness inside, character looking confused, a drop of slime falling through the air, suspenseful atmosphere",
"ContextField": "I threw it open. The floor was empty. But then... I felt a warm drip land on my forehead."
},
{
"ImagePrompt": "2D cartoon style, camera looking up at the closet ceiling, terrifying shadow monster with glowing red eyes and a wide toothy grin clinging to the top, high contrast, scary cartoon style",
"ContextField": "I looked up. And it smiled."
}
]


// const VIDEOSCRIPT = [
// {
// "ImagePrompt": "Realistic image, a cozy child's bedroom at dusk, soft warm lamplight, a small child (around 5-7 years old) tucked into bed, blankets pulled up, looking peaceful, stuffed animal beside them, gentle focus on the child's face.",
// "ContextField": "Once upon a time, in a little house nestled among soft green hills, lived a sleepy little bear named Barnaby."
// },
// {
// "ImagePrompt": "Realistic image, a small, worn teddy bear with a friendly expression, sitting alone on a moonlit windowsill, looking out at a starry night sky, soft blue and silver tones, a sense of quiet wonder.",
// "ContextField": "Barnaby loved his bedtime stories, but tonight, his favorite plush moon, Luna, seemed to be missing from her usual spot."
// },
// {
// "ImagePrompt": "Realistic image, a child's hand gently searching under a bed, toys partially visible in the shadows, dust motes catching the soft light from the bedroom, a sense of quiet searching.",
// "ContextField": "He peeked under his bed, behind his curtains, and even inside his toy chest, but Luna was nowhere to be found."
// },
// {
// "ImagePrompt": "Realistic image, close-up of a child's face, smiling gently, holding a small crescent moon-shaped plush toy, found among a pile of clean laundry, warm and soft lighting, feeling of relief and happiness.",
// "ContextField": "Then, he remembered! Mama had put her in the laundry basket by mistake, all clean and fresh!"
// },
// {
// "ImagePrompt": "Realistic image, a child's hand gently placing a crescent moon plush toy next to a sleeping teddy bear in bed, soft moonlight and lamplight creating a serene atmosphere, peaceful and calm.",
// "ContextField": "Barnaby snuggled Luna close, feeling a gentle warmth spread through him. She was safe, and now, he could truly rest."
// },
// {
// "ImagePrompt": "Realistic image, a sleeping child in a cozy bed, soft shadows, peaceful expression, blankets pulled up to their chin, dreamlike quality with a hint of shimmering stars subtly visible through the window, utterly calm and serene.",
// "ContextField": "As the moonbeams danced on his bedroom floor, Barnaby closed his eyes, drifting off to sleep, dreaming of adventures with his dearest Luna."
// }
// ]

const CreateNew = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();

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
    // const prompt =
      // "Write a script to generate " +
      // formData.duration +
      // " video on topic: " +
      // formData.topic +
      // " with the voice: " +
      // formData.voiceStyle +
      // " along with AI Images prompt in " +
      // formData.imageStyle +
      // " format for each scene and give me the result in JSON format with ImagePrompt and ContextField as field. No Plain Text. Do not include a title, duration, or any other fields.Do not add explanations before or after the JSON. Return only the JSON array.Respond ONLY with valid JSON, no markdown, no code blocks, no extra commentary. ";

    const prompt = `
You are an API that returns ONLY valid JSON.

Generate a script for a ${formData.duration} video on the topic "${formData.topic}"
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

    const resp = await axios.post("/api/get-video-script", {
      prompt: prompt,
    });
    console.log("resp.data.result", resp.data.result);
    console.log("TYPE:", typeof resp.data.result);
    console.log("IS ARRAY:", Array.isArray(resp.data.result));

    if (resp.data.result) {
    // if (VIDEOSCRIPT) {
      setVideoData((prev) => ({
        ...prev,
        "videoScript": resp.data.result,
        // "videoScript": VIDEOSCRIPT,
      }));
      setVideoScript(resp.data.result);
      // setVideoScript(VIDEOSCRIPT);
      // GenerateAudioFile(resp.data.result);
      resp.data.result && (await GenerateAudioFile(resp.data.result));
      // VIDEOSCRIPT && (await GenerateAudioFile(VIDEOSCRIPT));
      console.log("videoScriptData Generate Image:", resp.data.result);
      resp.data.result && (await GenerateImage(resp.data.result));
      // VIDEOSCRIPT && (await GenerateImage(VIDEOSCRIPT));
    }
    setLoading(false);
  };
  // get audio file
  const GenerateAudioFile = async (videoScriptData) => {
    // setLoading(true);
console.log("audio fine 1");

    let script = "";
    const id = uuidv4();
    videoScriptData.forEach((item) => {
      script = script + item.ContextField + " ";
    });
console.log("audio fine 2");

    console.log("videoScriptData:", script);

    const resp = await axios.post("/api/generate-audio", {
      text: script,
      id: id,
      voiceStyle: formData.voiceStyle,
    });
    console.log("GenerateAudioFile", resp.data);

    setVideoData((prev) => ({
      ...prev,
      "audioFileUrl": resp.data.result,
    }));
    setAudioFileUrl(resp.data.result); //Get File URL
    resp.data.result && (await GenerateAudioCaption(resp.data.result, script));

console.log("audio fine 3");

    // setLoading(false);
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
      "captions": resp.data.result,
    }));
    console.log("GenerateAudioCaption", resp.data.result);
    // console.log("videoScriptData Generate Image Caption:",resp.data.result);

    // setLoading(false);
  };

  // get AI image
  const GenerateImage = async (videoScriptData) => {
    // setLoading(true);

    let images = [];
    for (const element of videoScriptData) {
      try {
        const resp = await axios.post("/api/generate-image", {
          prompt: element.ImagePrompt,
        });
        console.log("GenerateImage", resp.data.result);
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
  };

  useEffect(() => {
    console.log("videoData", videoData);

    if (videoData && Object.keys(videoData).length === 4) {
      SaveVideoData(videoData);
    }
  }, [videoData]);

  const SaveVideoData = async (videoData) => {
    setLoading(true);

    const result = await db
      .insert(VideoData)
      .values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress.emailAddress,
      })
      .returning({ id: VideoData?.id });

    setVideoId(result[0].id);
    setPlayVideo(true);

    console.log("SaveVideoData", result);
    setLoading(false);

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
        <SelectVoice onUserSelect={onhandleInputChange} />
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
