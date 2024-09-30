import Image from "next/image";
import React from "react";
import { Oval } from "react-loader-spinner";
import * as motion from "framer-motion/client";

export default function NoteEndMessage({ isEnd }: { isEnd: boolean }) {
  return (
    <motion.label
      className="flex items-center flex-col"
      style={{ originY: 0 }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
    >
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
    </motion.label>
  );
}
