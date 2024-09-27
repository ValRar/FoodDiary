"use server";
import { Note, NoteResponse } from "@/interfaces/Note";
import { cookies } from "next/headers";
import { BASE_URL, JWT_NAME } from "../constants";

export default async function getNotesPage(startDate: Date): Promise<Note[]> {
  const token = cookies().get(JWT_NAME)?.value;

  const request = await fetch(
    `${BASE_URL}/notes/get_page?&minimum_length=10&start_day=${startDate.toDateString()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const response: NoteResponse[] = await request.json();
  const mappedResponse: Note[] = response.map((n) => {
    n.creationTime = new Date(Date.parse(n.creationTime as string));
    return n as Note;
  });
  return mappedResponse;
}
