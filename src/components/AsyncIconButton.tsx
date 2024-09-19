"use client";
import React, { useState } from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Image from "next/image";
import { Oval } from "react-loader-spinner";

export default function AsyncIconButton({
  src,
  alt,
  width,
  height,
  onClick,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onClick?: () => Promise<void>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <button
      onClick={() => {
        if (onClick) {
          setLoading(true);
          onClick().then(() => setLoading(false));
        }
      }}
      disabled={loading}
    >
      <LightBackgroundFiller
        className={"!p-2" + (className ? " " + className : "")}
      >
        {!loading ? (
          <Image src={src} alt={alt} height={height} width={width}></Image>
        ) : (
          <Oval width={width} height={height}></Oval>
        )}
      </LightBackgroundFiller>
    </button>
  );
}
