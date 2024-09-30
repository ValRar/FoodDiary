"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import React, { useState } from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Image from "next/image";
import SunImage from "../../public/sun.svg";
import MoonImage from "../../public/moon.svg";
import { DARK_THEME_COOKIE_NAME } from "@/actions/constants";

export default function ThemeChangerDropdown({
  showDarkInitial,
}: {
  showDarkInitial: boolean;
}) {
  const [showDark, setShowDark] = useState<boolean>(showDarkInitial);
  return (
    <Dropdown
      classNames={{
        content: "dark:bg-[#021702]",
      }}
    >
      <DropdownTrigger>
        <button className="interactive-button outline-none">
          <LightBackgroundFiller className="!p-5 !bg-[#51e64e] md:!bg-[#04db00]/[0.15]">
            <Image
              src={showDark ? MoonImage : SunImage}
              alt="current color theme icon"
              height={40}
              width={40}
              className="svg"
            ></Image>
          </LightBackgroundFiller>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          const htmlElement = document.getElementsByTagName("html")[0];
          switch (key) {
            case "light":
              document.cookie = `${DARK_THEME_COOKIE_NAME}=0`;
              htmlElement.classList.remove("dark");
              setShowDark(false);
              break;
            case "dark":
              document.cookie = `${DARK_THEME_COOKIE_NAME}=1`;
              htmlElement.classList.add("dark");
              setShowDark(true);
              break;
          }
        }}
        itemClasses={{
          base: "data-[hover=true]:bg-green-regular dark:data-[hover=true]:bg-green-dark-regular",
        }}
      >
        <DropdownItem
          key="dark"
          startContent={
            <Image
              src={MoonImage}
              alt="moon"
              height={15}
              width={15}
              className="svg"
            ></Image>
          }
        >
          Ночная тема
        </DropdownItem>
        <DropdownItem
          key="light"
          startContent={
            <Image
              src={SunImage}
              alt="sun"
              height={15}
              width={15}
              className="svg"
            ></Image>
          }
        >
          Дневная тема
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
