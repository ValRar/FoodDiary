import Image from "next/image";
import React from "react";
import { Oval } from "react-loader-spinner";

export default function NoteEndMessage({ isEnd }: { isEnd: boolean }) {
  return (
    <label className="flex items-center flex-col">
      {isEnd ? (
        <>
          <Image
            src="/file_corrupt.svg"
            alt="file corrupt"
            width={100}
            height={100}
            className="svg-green"
          ></Image>
          <span className="ml-4 mt-2 md:text-xl font-bold">
            Кажется, здесь больше ничего нет...
          </span>
        </>
      ) : (
        <>
          <Oval></Oval>
          <span className="ml-2 mt-2 md:text-xl font-bold">Загрузка...</span>
        </>
      )}
    </label>
  );
}
