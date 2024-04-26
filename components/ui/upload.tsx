import React, { ChangeEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface UploadButtonProps extends VariantProps<typeof buttonVariants> {
  onImageChange?: (file: File) => void;
  className?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onImageChange,
  variant,
  size,
  className,
}) => {
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    onImageChange?.(file);
    e.target.value = "";
  };
  return (
    <div>
      <label
        htmlFor="files"
        className={cn(buttonVariants({ variant, size, className }))}
      >
        Upload image
      </label>
      <input
        id="files"
        className="invisible w-0"
        type="file"
        title=" "
        accept="image/png, image/jpg, image/jpeg"
        onChange={handleUpload}
      />
    </div>
  );
};

export default UploadButton;
