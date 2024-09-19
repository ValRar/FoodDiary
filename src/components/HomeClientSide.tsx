"use client";
import getNotesPage from "@/actions/notes/getNotesPage";
import { Note } from "@/interfaces/Note";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import NoteCreatingForm from "./NoteCreatingForm";
import NotesView from "./NotesView";
import addNote from "@/actions/notes/addNote";
import deleteNote from "@/actions/notes/deleteNote";
import NoteEntry from "@/interfaces/NoteEntry";
import updateNote from "@/actions/notes/updateNote";

export default function HomeClientSide({ notes }: { notes: Note[] }) {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [page, setPage] = useState<number>(2);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [notesArr, setNotesArr] = useState<Note[]>(notes);

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
      setPage(page + 1);
      getNotesPage({ page, pageSize: 10 }).then((n) => {
        if (n.length == 0) setIsEnd(true);
        setNotesArr([...notesArr, ...n]);
      });
    }
  }, [inView]);
  return (
    <div className="xl:mx-96 md:mx-24 mx-2 pt-4">
      <NoteCreatingForm
        onSubmit={async (entries) => {
          const newNote = await addNote(entries);
          if (newNote) {
            setNotesArr([newNote, ...notesArr]);
          }
        }}
      ></NoteCreatingForm>
      <NotesView
        notes={notesArr}
        onDelete={onNoteDelete}
        onUpdate={onNoteUpdate}
      ></NotesView>
      <label ref={ref}></label>
    </div>
  );
}
