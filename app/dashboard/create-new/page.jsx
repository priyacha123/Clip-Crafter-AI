"use client";

import { useState } from "react";
import SelectTopic from "../_components/SelectTopic";
import SelectStyle from "../_components/SelectStyle";
import SelectDuration from "../_components/SelectDuration";
import { Button } from "../../../@/components/ui/button";
import axios from "axios";
import CustomeLoading from "../_components/CustomeLoading";

const CreateNew = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const[videoScript, setVideoScript] = useState()
  const onhandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    GetVideoScript();
  }

  // get video script
  const GetVideoScript = async () => {
    setLoading(true)
    const prompt = 'Write a script to generate '+formData.duration+' video on topic: '+formData.topic+' along with AI Images prompt in '+formData.imageStyle+' format for each scene and give me the result in JSON format with ImagePrompt and ContextField as field. No Plain Text'

    console.log(prompt);
    
    const result = await axios.post('/api/get-video-script', {
      prompt:prompt
    }).then(resp => {
      console.log("resp.data.result",resp.data);   
      setVideoScript(resp.data.result)  
    })
    setLoading(false)
  }

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
          <Button className="w-full"
          onClick={onCreateClickHandler}> Create Short Video </Button>
        </div>

      </div>
        <CustomeLoading loading={loading} />
    </>
  );
};

export default CreateNew;
