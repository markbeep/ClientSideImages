"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./header";

export const FadeInContext = React.createContext((boolean: boolean) => {});

interface FadeInProviderProps {}

const FadeInProvider: React.FC<
  React.PropsWithChildren<FadeInProviderProps>
> = ({ children }) => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<null | string>(null);

  useEffect(() => {
    if (previousPath === null || pathname !== previousPath) {
      setShow(true);
      setPreviousPath(pathname);
      return;
    }
  }, [pathname, previousPath]);

  return (
    <FadeInContext.Provider value={setShow}>
      <Header />
      <div
        className={cn("transition-opacity duration-500", !show && "opacity-0")}
      >
        {children}
      </div>
    </FadeInContext.Provider>
  );
};

export default FadeInProvider;
