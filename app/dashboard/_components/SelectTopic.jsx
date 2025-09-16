'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Textarea } from "components/ui/textarea";
import { useState } from "react";

const SelectTopic = ( { onUserSelect }) => {
  const options = ['Custome Prompt', 'Random AI Story', 'Scary Story', 'Historical Facts', 'Bed Time Story', 'Motivational Story', 'Fun Facts']
  const [selectedOption, setSelectedOption] = useState();

  return (
    <div className="p-10 flex flex-col gap-4">
      <h2 className="font-bold text-xl text-black">Content</h2>
      <p className="text-gray-500">What is the topic of your video?</p>
      <Select onValueChange={(value) => {
      setSelectedOption(value)
      value!='Custome Prompt' && onUserSelect('topic', value)
    }}>
        <SelectTrigger className="w-full mt-2 p- text-md">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger >
        <SelectContent>
          {options.map((option, index) => {
            return <SelectItem value={option} key={index}>{option}</SelectItem>
          })}
        </SelectContent>
      </Select>

      {selectedOption == 'Custome Prompt' &&
      <Textarea 
      className="mt-3" 
      onChange={(e) => onUserSelect(e.target.value)}
      placeholder='Write promt in which you want to generate video'
      />
      }
    </div>
  );
};

export default SelectTopic;
