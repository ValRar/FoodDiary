"use client";

import { Note } from "@/interfaces/Note";
import React, { useState } from "react";
import NoteCard from "./NoteCard";
import GroupedNotes from "@/interfaces/GroupedNotes";
import DayHeader from "./DayHeader";
import NoteEntry from "@/interfaces/NoteEntry";
import NoteCreatingForm from "./NoteCreatingForm";

function groupNotes(notes: Note[]): GroupedNotes[] {
  const groupedNotes: GroupedNotes[] = [];
  for (let i = 0; i < notes.length; i++) {
    let group = groupedNotes.findLast(
      (g) =>
        g.dayOfMonth === notes[i].creationTime.getDate() &&
        g.year === notes[i].creationTime.getFullYear() &&
        g.month === notes[i].creationTime.getMonth()
    );
    if (group) {
      group.notes.push(notes[i]);
      group.caloriesSum += notes[i].entries.reduce((acc, cur) => {
        return acc + (cur.calories ?? 0);
      }, 0);
    } else {
      groupedNotes.push({
        dayOfMonth: notes[i].creationTime.getDate(),
        dayOfWeek: notes[i].creationTime.getDay(),
        month: notes[i].creationTime.getMonth(),
        year: notes[i].creationTime.getFullYear(),
        notes: [notes[i]],
        caloriesSum: notes[i].entries.reduce((acc, cur) => {
          return acc + (cur.calories ?? 0);
        }, 0),
      });
    }
  }
  return groupedNotes;
}

function calculateKey(year: number, month: number, dayOfMonth: number): number {
  return (year - 2023) * month + dayOfMonth;
}

export default function NotesView({
  notes,
  onDelete,
  onUpdate,
}: {
  notes: Note[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, entries: NoteEntry[]) => void;
}) {
  const [changingNoteId, setChangingNoteId] = useState<number | undefined>();
  return (
    <section className="my-2">
      {groupNotes(notes).map((g) => (
        <div key={calculateKey(g.year, g.month, g.dayOfMonth)}>
          <DayHeader
            dayOfMonth={g.dayOfMonth}
            dayOfWeek={g.dayOfWeek}
            month={g.month}
            year={g.year}
            caloriesSum={g.caloriesSum}
            key={calculateKey(g.year, g.month, g.dayOfMonth)}
          ></DayHeader>
          <section>
            {g.notes.map((n) =>
              n.id !== changingNoteId ? (
                <NoteCard
                  note={n}
                  key={n.id}
                  onClickDelete={onDelete}
                  onClickUpdate={setChangingNoteId}
                  className="my-5"
                ></NoteCard>
              ) : (
                <NoteCreatingForm
                  initialValue={n}
                  onSubmit={(entries) => {
                    onUpdate(n.id, entries);
                    setChangingNoteId(undefined);
                  }}
                  key={n.id}
                ></NoteCreatingForm>
              )
            )}
          </section>
        </div>
      ))}
    </section>
  );
}
