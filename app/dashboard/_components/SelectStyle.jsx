import Image from "next/image";
import React, { useState } from "react";

const SelectStyle = ({ onUserSelect }) => {
  const [selectedOptions, setSelectedOption] = useState();
  const styleOptions = [
    {
      name: "Realstic",
      image: "/real.jpeg",
    },
    {
      name: "Cartoon",
      image: "/cartoon.jpg",
    },
    {
      name: "Comic",
      image: "/comic.jpg",
    },
    {
      name: "GTA",
      image: "/gta.jpg",
    },
    {
      name: "Historic",
      image: "/historic.jpg",
    },
    {
      name: "Watercolor",
      image: "/watercolor.jpg",
    },
  ];
  return (
    <div className="p-10">
      <h2 className="font-bold text-xl text-black">Style</h2>
      <p className="text-gray-500">Select your video style</p>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-5 gap-5">
          {styleOptions.map((item) => (
            <div
              key={item.name}
              className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl ${
                selectedOptions == item.name && "border-4 border-primary"
              }`}
            >
              <Image
                src={item.image}
                width={500}
                height={500}
                alt={item.name}
                className="h-100 object-cover rounded-lg w-full"
                onClick={() => {
                  setSelectedOption(item.name);
                  onUserSelect("imageStyle", item.name);
                }}
              />
              <h2 className="absolute p-1 bg-black bottom-0 w-full text-white text-center rounded-b-lg font-bold h-12 flex items-center justify-center">
                {" "}
                {item.name}{" "}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectStyle;
