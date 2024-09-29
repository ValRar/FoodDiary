"use client";
import calculateCalories from "@/actions/notes/calculateCalories";
import { Note } from "@/interfaces/Note";
import NoteEntry from "@/interfaces/NoteEntry";
import Image from "next/image";
import { useState } from "react";
import AsyncIconButton from "./AsyncIconButton";
import BackgroundFiller from "./BackgroundFiller";
import LightBackgroundFiller from "./LightBackgroundFiller";
import TextButton from "./TextButton";
import { displayDate } from "./utilities";
import dynamic from "next/dynamic";
const TimeSpan = dynamic(() => import("./TimeSpan"), {
  ssr: false,
});

export default function NoteCreatingForm({
  onSubmit,
  initialValue,
}: {
  onSubmit?: (entries: NoteEntry[]) => void;
  initialValue?: Note;
}) {
  const [note, setNote] = useState<Note>(
    initialValue
      ? initialValue
      : {
          creationTime: new Date(Date.now()),
          id: 0,
          entries: [{ id: 0, dish: "" }],
        }
  );
  function handleDishChange(input: string, id: number) {
    setNote({
      ...note,
      entries: note.entries.map((e) => {
        if (e.id !== id) return e;
        return {
          ...e,
          dish: input,
        };
      }),
    });
  }
  function handleCaloriesChange(input: string, id: number) {
    setNote({
      ...note,
      entries: note.entries.map((e) => {
        if (e.id !== id) return e;
        return {
          ...e,
          calories: parseCalories(input),
        };
      }),
    });
  }
  function addRow() {
    setNote({
      ...note,
      entries: [...note.entries, { dish: "", id: note.entries.length }],
    });
  }
  function removeRow(id: number) {
    setNote({
      ...note,
      entries: note.entries.filter((e) => e.id !== id),
    });
  }
  function parseCalories(value: string): number | undefined {
    try {
      return parseInt(value);
    } catch {
      return;
    }
  }
  return (
    <div className="md:pr-40">
      <BackgroundFiller className="relative">
        <div className="flex">
          <TimeSpan
            className="font-bold text-xl ml-2 mr-1"
            date={note.creationTime}
          ></TimeSpan>
          <Image
            height={24}
            width={24}
            src="/clock.svg"
            alt="clock icon"
            className="svg"
          />
        </div>
        <div className="my-2">
          {note.entries.map((e) => (
            <div key={e.id} className="md:my-6 mb-16 flex md:text-xl">
              <section className="absolute flex md:translate-y-0 md:-right-28 translate-y-8">
                <label
                  onClick={() => removeRow(e.id)}
                  className="mr-2 cursor-pointer"
                >
                  <LightBackgroundFiller className="!p-2 outline-green-text dark:md:outline-none dark:outline-green-dark-text outline-1 outline md:outline-none interactive-button">
                    <Image
                      src="/trash_bin.svg"
                      alt="trash bin"
                      height={30}
                      width={30}
                      className="svg"
                    ></Image>
                  </LightBackgroundFiller>
                </label>
                <AsyncIconButton
                  alt="magic stick"
                  src="/magic_stick.svg"
                  height={30}
                  width={30}
                  className="outline-green-text dark:md:outline-none dark:outline-green-dark-text outline-1 outline md:outline-none interactive-button"
                  onClick={async () => {
                    const calories = await calculateCalories(e.dish);
                    handleCaloriesChange(
                      calories?.toString() ?? e.calories?.toString() ?? "",
                      e.id
                    );
                  }}
                ></AsyncIconButton>
              </section>
              <span className="font-bold mr-1">·</span>
              <div className="flex-grow">
                <input
                  type="text"
                  className="bg-transparent outline-none w-full placeholder:text-green-text dark:placeholder:text-green-dark-text"
                  placeholder="Введите блюдо"
                  value={e.dish}
                  onChange={(event) => {
                    handleDishChange(event.target.value, e.id);
                  }}
                  onKeyUp={(event) => {
                    if (event.key === "Enter") {
                      addRow();
                      event.currentTarget.blur();
                    }
                  }}
                />
              </div>
              <span> | </span>
              <input
                type="number"
                className="w-20 bg-transparent outline-none placeholder:text-green-text dark:placeholder:text-green-dark-text"
                placeholder="ккал"
                onChange={(event) =>
                  handleCaloriesChange(event.target.value, e.id)
                }
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    addRow();
                    event.currentTarget.blur();
                  }
                }}
                value={e.calories}
              ></input>
            </div>
          ))}
        </div>
        <div className="md:mx-2">
          <TextButton
            onClick={(e) => {
              addRow();
            }}
          >
            <span className="lg:text-xl md:text-base text-xs font-bold">
              Добавить блюдо
            </span>
          </TextButton>
          <TextButton
            className="ml-3"
            onClick={() => (onSubmit ? onSubmit(note.entries) : undefined)}
          >
            <span className="lg:text-xl md:text-base text-xs font-bold">
              Завершить запись
            </span>
          </TextButton>
        </div>
      </BackgroundFiller>
    </div>
  );
}
