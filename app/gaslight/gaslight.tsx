"use client";

import UploadPage from "@/components/uploadPage";
import React, { useEffect, useState } from "react";

interface GaslightProps {}

const Gaslight: React.FC<GaslightProps> = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [savingState, setSavingState] = useState<
    "unknown" | "idle" | "saving" | "saved"
  >("unknown");

  // simulate loading image
  useEffect(() => {
    setTimeout(() => setSavingState("idle"), Math.random() * 1000 + 1000);
  }, []);

  // simulate saving image
  const onSave = () => {
    setTimeout(() => setSavingState("saved"), Math.random() * 1000 + 1000);
  };

  return (
    <UploadPage
      file={file}
      setFile={setFile}
      savingState={savingState}
      setSavingState={setSavingState}
      onSave={onSave}
    >
      <p>
        {`Images are stored when you press the save button. All images are
        persisted across refreshes or even browser restarts.`}
      </p>
      <p className="mt-2">
        {`Don't see your image? Try refreshing the page. If you still don't see
        it, are you sure you uploaded it? This page has gone through extensive
        testing to make sure uploaded images are correctly saved and work across
        any browser restarts, clearing of cookies, VPN changes, or any other
        changes that might affect storage.`}
      </p>
    </UploadPage>
  );
};

export default Gaslight;
