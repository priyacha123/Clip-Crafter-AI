'use client'

import { Button } from "components/ui/button";
import { useState } from "react";

const SelectVoice = ( { onUserSelect }) => {
  const options = [
    'Female',
    'MALE',
    'ROBOTIC',
    'CHILD',
    'DEEP VOICE',
    'ANIMATED',
    'NARRATOR'
  ];
  const [selectedVoice, setSelectedVoice] = useState();

  return (
    <div className="p-10 flex flex-col gap-4">
      <h2 className="font-bold text-3xl text-black dark:text-white">Video</h2>
       <p className="text-gray-500">Which type of voice would you want for your video?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-5 gap-5">
          {options.map((option, index) => {
              return <Button
              className={`relative flex justify-center items-center hover:scale-105 hover:text-white hover:bg-gray-800 dark:hover:bg-secondary transition-all cursor-pointer rounded-xl ${
                selectedVoice == option && "border-2 bg-gray-800 dark:bg-secondary text-white"
              }`}
               onClick={() => {
                  setSelectedVoice(option);
                  onUserSelect("voiceStyle", option);}}
               value={option} key={index}>{option}</Button>
            })}
            </div>
    </div>
  );
};

export default SelectVoice;
