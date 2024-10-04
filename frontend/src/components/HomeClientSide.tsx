"use client";
import getNotesPage from "@/actions/notes/getNotesPage";
import { Note } from "@/interfaces/Note";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import NoteCreatingForm from "./NoteCreatingForm";
import addNote from "@/actions/notes/addNote";
import deleteNote from "@/actions/notes/deleteNote";
import NoteEntry from "@/interfaces/NoteEntry";
import updateNote from "@/actions/notes/updateNote";
import NoteEndMessage from "./NoteEndMessage";
import NotesView from "./NotesView";

export default function HomeClientSide({ notes }: { notes: Note[] }) {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [notesArr, setNotesArr] = useState<Note[]>(notes);
  function createNextDate(lastDate: Date): Date {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() - 1);
    return nextDate;
  }
  const [currentDate, setCurrentDate] = useState<Date>(
    createNextDate(notes.at(-1)?.creationTime ?? new Date(Date.now()))
  );
  async function onNoteDelete(id: number) {
    const success = await deleteNote(id);
    if (success) {
      setNotesArr(notesArr.filter((n) => n.id !== id));
    }
  }
  async function onNoteUpdate(id: number, entries: NoteEntry[]) {
    const isSuccess = await updateNote(id, entries);
    if (isSuccess) {
      setNotesArr(
        notesArr.map((n) => {
          if (n.id === id) {
            return {
              ...n,
              entries,
            };
          }
          return n;
        })
      );
    }
  }
  useEffect(() => {
    if (inView && !isEnd) {
      getNotesPage(currentDate).then((n) => {
        setNotesArr([...notesArr, ...n]);
        if (n.length > 0)
          setCurrentDate(createNextDate(n.at(-1)!.creationTime));
        else setIsEnd(true);
      });
    }
  }, [inView]);
  return (
    <div className="xl:mx-96 md:mx-24 lg:mx-48 mx-2 pt-4">
      <NoteCreatingForm
        onSubmit={async (entries) => {
          const newNote = await addNote(entries);
          if (newNote) {
            setNotesArr([newNote, ...notesArr]);
            return true;
          }
          return false;
        }}
      ></NoteCreatingForm>
      <NotesView
        notes={notesArr}
        onDelete={onNoteDelete}
        onUpdate={onNoteUpdate}
      ></NotesView>
      <label ref={ref}>
        <NoteEndMessage isEnd={isEnd}></NoteEndMessage>
      </label>
    </div>
  );
}
