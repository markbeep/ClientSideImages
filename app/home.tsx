"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShow(true);
  }, []);

  const handleLink = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (!show) return;
    setShow(false);
    setTimeout(() => {
      router.push(path);
    }, 1000);
  };

  return (
    <ul
      className={cn("transition-opacity duration-1000", !show && "opacity-0")}
    >
      <li>
        <Link href="/base64" onClick={handleLink("/base64")}>
          Base 64
        </Link>
      </li>
    </ul>
  );
};

export default HomePage;
