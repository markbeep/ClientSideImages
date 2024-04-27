"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import UploadCard from "../../components/ui/upload";
import { compressImage, fromBase64, getBase64 } from "../util/imageUtil";

export const Base64: React.FC = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [loadingState, setLoadingState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const clear = () => {
    setLoadingState("idle");
    localStorage.removeItem("image");
  };

  // Load image on page load
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
      setLoadingState("saved");
    }
  }, []);

  const onSave = async () => {
    setLoadingState("saving");
    if (!file) return;
    let compressed: Blob | null = null;
    // Compress image until it's less than 4.5MB
    while (compressed === null || compressed.size > 4.5e6) {
      compressed = await compressImage(file, { quality: 0.5 });
      if (!compressed) {
        console.error("Failed to compress image");
        clear();
        return;
      }
    }
    setFile(compressed);
    const base64 = await getBase64(compressed);
    localStorage.setItem("image", base64);
    setTimeout(() => setLoadingState("saved"), 1000);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2",
        "transition-opacity duration-1000",
      )}
    >
      <UploadCard
        className="transition-all duration-500 ease-in-out"
        onImageChange={() => setLoadingState("idle")}
        onClear={clear}
        file={file}
        setFile={setFile}
      />
      <div
        className={cn(
          "flex gap-2 transition-all w-full overflow-hidden duration-500",
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
