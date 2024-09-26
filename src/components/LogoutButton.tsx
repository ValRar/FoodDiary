"use client";
import React from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Image from "next/image";
import logout from "@/actions/authentication/logout";

export default function LogoutButton() {
  return (
    <button onClick={() => logout()} className="ml-2 interactive-button">
      <LightBackgroundFiller className="!p-5 cursor-pointer">
        <Image
          src="/exit.svg"
          alt="exit icon"
          width={40}
          height={40}
          className="svg"
        ></Image>
      </LightBackgroundFiller>
    </button>
  );
}
