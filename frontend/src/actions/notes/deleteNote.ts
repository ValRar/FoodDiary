"use server";

import { cookies } from "next/headers";
import { BASE_URL, JWT_NAME } from "../constants";

export default async function deleteNote(noteId: number): Promise<boolean> {
  const token = cookies().get(JWT_NAME)?.value;
  const request = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return request.ok;
}
