"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext } from "react";
import { FadeInContext } from "./fadeProvider";

const paths = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/base64",
    name: "Base 64",
  },
  {
    path: "/gaslight",
    name: "Gaslight",
  },
];

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const pathname = usePathname();

  const router = useRouter();
  const setShow = useContext(FadeInContext);

  const handleLink = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(false);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  return (
    <div className="absolute top-0 left-0 w-full flex items-center px-10 py-4 gap-2 z-10">
      {paths.map(({ path, name }) => (
        <Button
          variant="outline"
          asChild={path !== pathname}
          disabled={path === pathname}
          key={path}
        >
          {path === pathname ? (
            name
          ) : (
            <Link href={path} onClick={handleLink(path)}>
              {name}
            </Link>
          )}
        </Button>
      ))}
    </div>
  );
};

export default Header;
