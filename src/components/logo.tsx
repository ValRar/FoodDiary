import React from "react";
import { Pacifico } from "next/font/google";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Image from "next/image";

const pacifico = Pacifico({
  weight: "400",
  display: "swap",
  subsets: ["cyrillic"],
});

export default function Logo() {
  return (
    <LightBackgroundFiller>
      <div className="flex items-center">
        <Image
          src="/note.svg"
          alt="Note icon"
          width={50}
          height={50}
          className="flex-initial"
        />
        <div
          className={pacifico.className + " md:text-3xl text-2xl flex-initial"}
          style={{
            color: "#04D900",
          }}
        >
          Дневник питания
        </div>
      </div>
    </LightBackgroundFiller>
  );
}
