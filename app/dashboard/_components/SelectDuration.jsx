import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

const SelectDuration = ( { onUserSelect }) => {
  return (
    <div className="p-10 flex flex-col gap-4">
      <h2 className="font-bold text-xl text-black">Duration</h2>
      <p className="text-gray-500"> Select the duration of your video</p>
      <Select onValueChange={(value) => {
      setSelectedOption(value)
      value!='Custome Prompt' && onUserSelect('duration', value)
    }}>
        <SelectTrigger className="w-full mt-2 p- text-md">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger >
        <SelectContent>
            <SelectItem value='15 seconds'> 15 seconds </SelectItem>
            <SelectItem value='30 seconds'> 30 seconds </SelectItem>
            <SelectItem value='45 seconds'> 45 seconds </SelectItem>
            <SelectItem value='1 minutes'> 1 minutes </SelectItem>
            <SelectItem value='2 minutes'> 2 minutes </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDuration;
