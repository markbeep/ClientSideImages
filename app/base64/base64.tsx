"use client";

import UploadPage from "@/components/uploadPage";
import React, { useEffect, useState } from "react";
import { compressImage, fromBase64, getBase64 } from "../../lib/imageUtil";

export const Base64: React.FC = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [savingState, setSavingState] = useState<
    "unknown" | "idle" | "saving" | "saved"
  >("unknown");

  const onClear = () => {
    localStorage.removeItem("image");
  };

  // Load image on page load
  useEffect(() => {
    const base64 = localStorage.getItem("image");
    if (!base64) {
      setTimeout(() => setSavingState("idle"), 1000);
      return;
    }
    const img = fromBase64(base64);
    if (!img) {
      console.error("Failed to convert base64 to image");
      onClear();
      return;
    }
    // Loading image too quickly causes flickering
    setTimeout(() => setFile(img), 800);
    setTimeout(() => setSavingState("saved"), 1000);
  }, []);

  const onSave = async () => {
    setSavingState("saving");
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
        onClear();
        return;
      }

      const newSize = compressed.size;
      console.log(
        `Image too large, compressing further. ${oldSize} -> ${newSize}`,
      );
    }
    setFile(compressed);
    // Changing states too quick looks odd
    setTimeout(() => setSavingState("saved"), 300);
  };
  return (
    <UploadPage
      file={file}
      setFile={setFile}
      savingState={savingState}
      setSavingState={setSavingState}
      onClear={onClear}
      onSave={onSave}
    >
      <p>
        {`Websites can use up to 5MB of local storage. This data persists across
        refreshes and even browser restarts. This is a good way for browsers to
        store user-specific information like settings.`}
      </p>
      <p className="mt-2">
        {`The first limitation of local storage is that it only allows for strings
        to be stored. Because of this any images uploaded are first converted to
        base64. This increases the file size by roughly 33%.`}
      </p>
      <p className="mt-2">
        {`The second limitation is that there's a max size of 5MB. This means huge
        images can't be stored there. Any images that would be too large to fit
        are compressed down until they do.`}
      </p>
      <p className="mt-2">
        {`If you clear the website's data (usually done together with clearing
        cookies), the image will also be removed.`}
      </p>
    </UploadPage>
  );
};
