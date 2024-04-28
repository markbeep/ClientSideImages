"use client";

import { CustomImage, useCustomImage } from "@/lib/imageUtil";
import { cn } from "@/lib/utils";
import { Check, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface UploadButtonProps {
  onImageChange?: ({
    image,
    width,
    height,
  }: {
    image: CustomImage | null;
    width: number;
    height: number;
  }) => void;
  file: File | Blob | null;
  setFile: (file: File | Blob | null) => void;
  onClear?: () => void;
  onSave?: () => void;
  savingSate: "unknown" | "idle" | "saving" | "saved";
  className?: string;
}

const UploadCard: React.FC<UploadButtonProps> = ({
  onImageChange,
  file,
  setFile,
  onClear,
  onSave,
  savingSate,
  className,
}) => {
  const { image, width, height } = useCustomImage(file);
  const [drag, setDrag] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    // prevent calling onImageChanged if 'file' is updated but 'image' is not
    if (imageChanged) {
      setImageChanged(false);
      onImageChange?.({ image, width, height });
    }
  }, [image, width, height, imageChanged, onImageChange]);

  const clear = () => {
    setDrag(false);
    setFile(null);
    onClear?.();
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    setDrag(false);
    if (!file || !file.type.startsWith("image")) return;
    setFile(file);
    e.target.value = "";
    setImageChanged(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    setFile(file);
    setImageChanged(true);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragStart={() => setDrag(true)}
      onDragEnter={() => setDrag(true)}
      onDragExit={() => setDrag(false)}
      onDragLeave={() => setDrag(false)}
    >
      <label htmlFor="files">
        <Card
          className={cn(
            "transition-all duration-1000 max-h-[min(500px,80vw)] max-w-[min(500px,80vw)]",
            !image && "h-[80vw] w-[80vw]",
          )}
        >
          <CardContent
            className={cn(
              "overflow-hidden flex justify-center items-center p-4 sm:p-8",
              "relative cursor-pointer w-full h-full",
              className,
            )}
          >
            {image && (
              <>
                <div className="absolute top-2 right-3.5 flex flex-row gap-1 items-center justify-center">
                  <Button
                    title="Save image"
                    className={cn(
                      "p-1 h-fit w-fit transition-opacity duration-500",
                      savingSate === "saving" && "animate-pulse",
                      savingSate === "saved" && "text-green-800",
                      savingSate === "unknown" && "opacity-0",
                    )}
                    onClick={e => {
                      e.preventDefault();
                      onSave?.();
                    }}
                    disabled={savingSate === "saving" || savingSate === "saved"}
                    variant="outline"
                    size="icon"
                  >
                    {savingSate === "saved" ? <Check /> : <Save />}
                  </Button>

                  <Button
                    title="Clear image"
                    className="p-1 h-fit w-fit"
                    onClick={e => {
                      e.preventDefault();
                      clear();
                    }}
                    variant="outline"
                    size="icon"
                  >
                    <X />
                  </Button>
                </div>

                <Image
                  src={image.url}
                  alt=""
                  width={Math.min(width, 500)}
                  height={Math.min(height, 500)}
                />
              </>
            )}
            {!image && (
              <div
                className={cn(
                  "w-full h-full flex flex-col justify-center items-center rounded transition-colors bg-card duration-300",
                  "text-gray-400",
                  drag && "bg-green-200",
                )}
              >
                {savingSate === "unknown" ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Upload className="h-12 w-12" strokeWidth={1} />
                    {drag ? "Drop image here" : "Click or drag to upload"}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </label>
      <input
        id="files"
        className="hidden"
        type="file"
        title=" "
        accept="image/png, image/jpg, image/jpeg"
        onChange={handleUpload}
      />
    </div>
  );
};

export default UploadCard;
