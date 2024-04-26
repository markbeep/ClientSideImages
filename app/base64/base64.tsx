"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import UploadButton from "../../components/ui/upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  compressImage,
  fromBase64,
  getBase64,
  useCustomImage,
} from "../util/imageUtil";
import Image from "next/image";

export const Base64: React.FC = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const { image, width, height } = useCustomImage(file);
  const [[actualWidth, actualHeight], setActualDimensions] = useState([
    width,
    height,
  ]);
  const [showCard, setShowCard] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

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

  const clear = () => {
    setFile(null);
    setState("idle");
    localStorage.removeItem("image");
  };

  useEffect(() => {
    const base64 = localStorage.getItem("image");
    if (base64) {
      const img = fromBase64(base64);
      if (!img) {
        console.error("Failed to convert base64 to image");
        clear();
        return;
      }
      setFile(img);
      setState("saved");
    }
  }, []);

  // Fade in card
  useEffect(() => {
    setShowCard(true);
  });

  const onSave = async () => {
    setState("saving");
    if (!image) return;
    let compressed: Blob | null = null;
    // Compress image until it's less than 4.5MB
    while (compressed === null || compressed.size > 4.5e6) {
      compressed = await compressImage(image.file, { quality: 0.5 });
      if (!compressed) {
        console.error("Failed to compress image");
        clear();
        return;
      }
    }
    setFile(compressed);
    const base64 = await getBase64(compressed);
    localStorage.setItem("image", base64);
    setTimeout(() => setState("saved"), 1000);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-center",
        "transition-opacity duration-1000",
        !showCard && "opacity-0",
      )}
    >
      <Card>
        <CardContent
          className={cn(
            "overflow-hidden flex justify-center items-center p-8",
            "transition-all duration-1000",
            !image && "h-[500px] w-[500px]",
          )}
          style={
            actualWidth && actualHeight
              ? { width: actualWidth, height: actualHeight }
              : undefined
          }
        >
          {!image && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Where is my image?</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Where is my image?</DialogHeader>
                <DialogDescription>
                  Images are uploaded to the browser's local storage. If you
                  don't see it, the local storage might have been cleared and
                  you have to re-upload it. Up to 5MB of images can be stored.
                  Anything bigger has to be compressed.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
          {image && (
            <>
              <Image
                src={image.url}
                alt=""
                width={Math.min(width, 500)}
                height={Math.min(height, 500)}
              />
            </>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-start w-full">
        <UploadButton
          variant="outline"
          className="transition-all duration-500 ease-in-out"
          onImageChange={file => {
            setFile(file);
            setState("idle");
          }}
        />
        <div
          className={cn(
            "flex gap-2 transition-all w-full overflow-hidden duration-500 ml-2",
            !image && "w-0 opacity-0 ml-0",
          )}
        >
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
          <Button
            variant="secondary"
            disabled={!image || state === "saved" || state === "saving"}
            onClick={onSave}
          >
            {state === "saving"
              ? "Saving..."
              : state === "saved"
              ? "Saved!"
              : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
