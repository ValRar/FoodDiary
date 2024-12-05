import Link from "next/link";
import React from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import BackArrow from "./svg/BackArrow";

export default function ReturnButton() {
  return (
    <Link href="/">
      <LightBackgroundFiller className="h-20 items-center flex justify-center mr-2 interactive-button">
        <BackArrow className="svg h-10 w-10 align-middle"></BackArrow>
      </LightBackgroundFiller>
    </Link>
  );
}
