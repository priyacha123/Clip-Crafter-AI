"use client";

import React, { useRef } from "react";
import { Button } from "components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";

const MAX_REFERENCE_IMAGES = 1;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));

    reader.readAsDataURL(file);
  });

const ImageReferenceUpload = ({ value = [], onChange }) => {
  const inputRef = useRef(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, MAX_REFERENCE_IMAGES);

    const oversizedFile = validFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFile) {
      alert(`${oversizedFile.name} is larger than 5MB.`);
      event.target.value = "";
      return;
    }

    try {
      const nextImages = await Promise.all(
        validFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          dataUrl: await readFileAsDataUrl(file),
        }))
      );

      onChange(nextImages);
    } catch (error) {
      console.error("Failed to load reference images", error);
      alert("Failed to load one or more images.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleClear = () => {
    onChange([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="p-10 flex flex-col gap-4">
      <h2 className="font-bold text-3xl text-black dark:text-white">
        Reference Image
      </h2>
      <p className="text-gray-500">
        Optional. Upload 1 image to guide the look of generated scenes.
      </p>

      <div className="mt-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="reference-images-input"
          onChange={handleFileChange}
        />

        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background px-5 py-4 transition-all hover:border-primary hover:bg-accent/40"
          onClick={openFilePicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openFilePicker();
            }
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ImagePlus className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white">
                Upload reference image
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, or WebP. Optional, max 5MB.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openFilePicker();
            }}
          >
            Choose Image
          </Button>
        </div>

        {value.length > 0 ? (
          <>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {value.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="overflow-hidden rounded-xl border border-border bg-background transition-all hover:scale-[1.02]"
                >
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="h-52 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-black dark:text-white">
                        {image.name}
                      </p>
                      <p className="text-xs text-gray-500">Reference image</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-1">
              <Button type="button" variant="ghost" onClick={handleClear}>
                Clear all
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ImageReferenceUpload;
