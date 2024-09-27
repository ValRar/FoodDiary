"use server";

import NoteEntry from "@/interfaces/NoteEntry";
import { cookies } from "next/headers";
import { BASE_URL, JWT_NAME } from "../constants";
import { Note, NoteResponse } from "@/interfaces/Note";

export default async function addNote(
  entries: NoteEntry[]
): Promise<Note | undefined> {
  const token = cookies().get(JWT_NAME)?.value;
  const body = JSON.stringify({ entries });
  const request = await fetch(`${BASE_URL}/notes/`, {
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (request.ok) {
    const note: NoteResponse = await request.json();

    return {
      ...note,
      creationTime: new Date(Date.parse(note.creationTime as string)),
    };
  }
  return undefined;
}
