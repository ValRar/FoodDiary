"use server";
import NoteEntry from "@/interfaces/NoteEntry";
import { BASE_URL, JWT_NAME } from "../constants";
import { cookies } from "next/headers";

export default async function updateNote(
  id: number,
  entries: NoteEntry[]
): Promise<boolean> {
  const token = cookies().get(JWT_NAME)?.value;
  const request = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entries }),
  });
  return request.ok;
}
