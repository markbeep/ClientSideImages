"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { FadeInContext } from "./fadeProvider";
import { Button } from "@/components/ui/button";

export const paths = [
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

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setShow = useContext(FadeInContext);

  const handleLink = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(false);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  // fade in
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <ul className="flex flex-col gap-2">
      {paths
        .filter(({ path }) => path !== "/")
        .map(({ path, name }) => (
          <li key={path}>
            <Button
              variant="outline"
              asChild={path !== pathname}
              disabled={path === pathname}
              className="w-full"
            >
              {path === pathname ? (
                name
              ) : (
                <Link href={path} onClick={handleLink(path)}>
                  {name}
                </Link>
              )}
            </Button>
          </li>
        ))}
    </ul>
  );
};

export default HomePage;
