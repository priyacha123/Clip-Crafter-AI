"use client";

import { useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../@/components/ui/button";
import axios from "axios";
import CustomeLoading from "./_components/CustomeLoading";
import { v4 as uuidv4 } from 'uuid';


const scriptdata = " In a room bathed in moonlight, a little boy named Leo snuggled deep into his covers, ready for a story. His father opened a book of magical tales. 'Tonight,' he whispered, 'we'll meet a brave little dragon.' Deep in an enchanted forest, a tiny dragon named Sparky hatched from a shimmering egg. But Sparky was all alone and couldn't find his family. He let out a tiny, whimpering puff of smoke. Leo listened, his heart aching for the little dragon. 'He needs help,' he thought. Just then, a tiny light flickered in the darkness. It was a brave firefly named Flicker! 'This way!' buzzed Flicker, leading Sparky through the Whispering Woods. Flicker led him to a crystal cave, where Sparky’s family was waiting with open wings! With Sparky safe, Dad closed the book. Leo smiled, feeling warm and ready for sleep. And as he drifted off, he dreamed of soaring through the night sky with his new dragon friend. The End. "
const CreateNew = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const onhandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    // GetVideoScript();
    GenerateAudioFile(scriptdata)
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
      " format for each scene and give me the result in JSON format with ImagePrompt and ContextField as field. No Plain Text. Do not include a title, duration, or any other fields.Do not add explanations before or after the JSON. Return only the JSON array.Respond ONLY with valid JSON, no markdown, no code blocks, no extra commentary. ";

    console.log(prompt);

    const result = await axios
      .post("/api/get-video-script", {
        prompt: prompt,
      })
      .then((resp) => {
        console.log("resp.data", resp.data.result);
        console.log("TYPE:", typeof resp.data.result);
        console.log("IS ARRAY:", Array.isArray(resp.data.result));

        setVideoScript(resp.data.result);
        GenerateAudioFile(resp.data.result);
      });
    setLoading(false);
  };

  const GenerateAudioFile = async (videoScriptData) => {
    setLoading(true);

    let script = "";
    const id = uuidv4();
    // videoScriptData.forEach((item) => {
    //   script = script + item.ContextField + " ";
    // });

    console.log(script);

    await axios.post('/api/generate-audio', {
      text: videoScriptData,
      id: id
    }).then(resp => {
      console.log(resp.data);
      setAudioFileUrl(resp.data.result)
      
    })
    setLoading(false);

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
    </>
  );
};

export default CreateNew;
