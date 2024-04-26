import React, { useState } from "react";

export class CustomImage {
  public readonly url: string;
  public readonly image: HTMLImageElement;
  constructor(
    public readonly file: File | Blob,
    setDimensions: (dimensions: [number, number]) => void,
  ) {
    this.file = file;
    this.url = URL.createObjectURL(file);
    this.image = new Image();
    this.image.src = this.url;
    this.image.onload = () =>
      setDimensions([this.image.width, this.image.height]);
  }
}

export const useCustomImage = (file: File | Blob | null) => {
  const [image, setImage] = useState<CustomImage | null>(null);
  const [[width, height], setDimensions] = useState<[number, number]>([0, 0]);
  React.useEffect(() => {
    if (file) {
      setImage(new CustomImage(file, setDimensions));
    } else {
      setImage(null);
      setDimensions([0, 0]);
    }
  }, [file]);
  return { image, width, height };
};

export async function getBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function fromBase64(base64: string): File | null {
  const base64String = base64.split(",")[1];
  try {
    const byteString = atob(base64String);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], "image.png", { type: "image/png" });
  } catch (e) {
    return null;
  }
}

export async function compressImage(
  file: File | Blob,
  { quality = 1, type = file.type },
): Promise<Blob | null> {
  // Get as image data
  const imageBitmap = await createImageBitmap(file);

  // Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(imageBitmap, 0, 0);

  // Turn into Blob
  return await new Promise(resolve => canvas.toBlob(resolve, type, quality));
}
