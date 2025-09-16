"use client";

import { useState } from "react";
import SelectTopic from "../_components/SelectTopic";
import SelectStyle from "../_components/SelectStyle";
import SelectDuration from "../_components/SelectDuration";
import { Button } from "components/ui/button";

const CreateNew = () => {
  const [formData, setFormData] = useState([]);
  const onhandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
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
          <Button className="w-full"> Create Short Video </Button>
        </div>
      </div>
    </>
  );
};

export default CreateNew;
