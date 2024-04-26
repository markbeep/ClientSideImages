"use client";

import clsx from "clsx";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

export const Base64: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    e.target.value = "";
  };
  return (
    <div className="flex flex-col gap-8 items-center">
      <div
        className={clsx(
          "overflow-hidden rounded-lg shadow-lg flex items-center justify-center p-4 bg-custom-light",
          !image && "h-[500px] w-[500px]",
        )}
      >
        Where is my image?
        {image && <Image src={image} alt="" width={500} height={500} />}
      </div>
      <input
        className="file:p-2 file:rounded file:border-2 file:border-custom-grey file:bg-custom-light file:shadow-none"
        type="file"
        title=" "
        accept="image/png, image/jpg, image/jpeg"
        onChange={handleUpload}
      />
      <button>Send to gulag</button>
    </div>
  );
};
