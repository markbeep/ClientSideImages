"use client";

import { CustomImage, useCustomImage } from "@/app/util/imageUtil";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
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
  className?: string;
}

const UploadCard: React.FC<UploadButtonProps> = ({
  onImageChange,
  file,
  setFile,
  onClear,
  className,
}) => {
  const { image, width, height } = useCustomImage(file);
  const [[actualWidth, actualHeight], setActualDimensions] = useState([
    width,
    height,
  ]);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    if (width && height) {
      if (width > 500 || height > 500) {
        const ratio = Math.min(500 / width, 500 / height);
        setActualDimensions([width * ratio, height * ratio]);
      } else {
        setActualDimensions([width, height]);
      }
    } else {
      setActualDimensions([500, 500]);
    }
  }, [width, height]);

  useEffect(() => {
    onImageChange?.({ image, width, height });
  }, [image, width, height]);

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
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    setFile(file);
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
        <Card>
          <CardContent
            className={cn(
              "overflow-hidden flex justify-center items-center p-8",
              "transition-all duration-1000 relative cursor-pointer",
              !image && "h-[500px] w-[500px]",
              className,
            )}
            style={
              actualWidth && actualHeight
                ? { width: actualWidth, height: actualHeight }
                : undefined
            }
          >
            {image && (
              <>
                <Button
                  className="absolute top-2 right-3.5 p-1 h-fit w-fit"
                  onClick={e => {
                    e.preventDefault();
                    clear();
                  }}
                  variant="outline"
                  size="icon"
                >
                  <X />
                </Button>
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
                <Upload className="h-12 w-12" strokeWidth={1} />
                {drag ? "Drop image here" : "Click or drag to upload"}
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
