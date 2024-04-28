import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";
import UploadCard from "./ui/upload";
import { Card, CardContent } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface UploadPageProps {
  file: File | Blob | null;
  setFile: (file: File | Blob | null) => void;
  savingState: "unknown" | "idle" | "saving" | "saved";
  setSavingState: (state: "unknown" | "idle" | "saving" | "saved") => void;

  onClear?: () => void;
  onSave?: () => void;

  className?: string;
}

const UploadPage: React.FC<PropsWithChildren<UploadPageProps>> = ({
  file,
  setFile,
  savingState,
  setSavingState,

  onClear,
  onSave,

  children,

  className,
}) => {
  const clear = () => {
    setSavingState("idle");
    onClear?.();
  };

  const save = () => {
    setSavingState("saving");
    onSave?.();
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "transition-all duration-1000 gap-4",
        className,
      )}
    >
      <UploadCard
        className="transition-all duration-500 ease-in-out"
        onImageChange={() => setSavingState("idle")}
        onClear={clear}
        file={file}
        setFile={setFile}
        savingSate={savingState}
        onSave={save}
      />

      {children && (
        <Card className="max-w-[30rem] w-4/5 min-w-[15rem]">
          <CardContent className="py-0">
            <Accordion type="multiple">
              <AccordionItem value="information">
                <AccordionTrigger>How does this work?</AccordionTrigger>
                <AccordionContent>{children}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadPage;
