"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useContext, useEffect, useState } from "react";
import UploadCard from "../../components/ui/upload";
import { compressImage, fromBase64, getBase64 } from "../util/imageUtil";
import { FadeInContext } from "../fadeProvider";

export const Base64: React.FC = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [loadingState, setLoadingState] = useState<
    "unknown" | "idle" | "saving" | "saved"
  >("unknown");
  const setShow = useContext(FadeInContext);

  // fade in
  useEffect(() => {
    setShow(true);
  }, []);

  const clear = () => {
    setLoadingState("idle");
    localStorage.removeItem("image");
  };

  // Load image on page load
  useEffect(() => {
    const base64 = localStorage.getItem("image");
    if (!base64) {
      setTimeout(() => setLoadingState("idle"), 1000);
      return;
    }
    const img = fromBase64(base64);
    if (!img) {
      console.error("Failed to convert base64 to image");
      clear();
      return;
    }
    setTimeout(() => setFile(img), 800);
    setTimeout(() => setLoadingState("saved"), 1000);
  }, []);

  const onSave = async () => {
    setLoadingState("saving");
    if (!file) return;
    let compressed: Blob | null = file;
    // Compress image until it can be saved without error
    while (true) {
      const base64 = await getBase64(compressed);
      try {
        localStorage.setItem("image", base64);
        break;
      } catch (e) {}
      const oldSize = compressed.size;
      compressed = await compressImage(file, { quality: 0.7 });

      if (!compressed) {
        console.error("Failed to compress image");
        clear();
        return;
      }

      const newSize = compressed.size;
      console.log(
        `Image too large, compressing further. ${oldSize} -> ${newSize}`,
      );
    }
    setFile(compressed);
    setTimeout(() => setLoadingState("saved"), 1000);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center",
        "transition-all duration-1000 gap-0",
        file && "gap-2",
      )}
    >
      <UploadCard
        className="transition-all duration-500 ease-in-out"
        onImageChange={() => setLoadingState("idle")}
        onClear={clear}
        file={file}
        loading={loadingState === "unknown"}
        setFile={setFile}
      />
      <div
        className={cn(
          "flex gap-2 transition-all justify-end w-full overflow-hidden duration-500",
          !file && "w-0 opacity-0 ml-0",
        )}
      >
        <Button
          variant="outline"
          disabled={
            !file || loadingState === "saved" || loadingState === "saving"
          }
          onClick={onSave}
        >
          {loadingState === "saving"
            ? "Saving..."
            : loadingState === "saved"
            ? "Saved!"
            : "Save"}
        </Button>
      </div>
    </div>
  );
};
