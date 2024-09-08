"use server";
import { Note, NoteResponse } from "@/interfaces/Note";
import NotesPageParams from "@/interfaces/NotesPageParams";
import { BASE_URL, JWT_NAME } from "../constants";
import { cookies, headers } from "next/headers";
import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export default async function getNotesPage({
	page,
	pageSize,
}: NotesPageParams): Promise<Note[]> {
	const token =
		cookies().get(JWT_NAME)?.value ??
		headers()
			.getSetCookie()
			.map(parseCookie)
			.find((c) => c.has(JWT_NAME))
			?.get(JWT_NAME);
	const request = await fetch(
		`${BASE_URL}/notes/get_page?page=${page}&pageSize=${pageSize}`,
		{ method: "GET", headers: { Authorization: `Bearer ${token}` } }
	);
	const response: NoteResponse[] = await request.json();
	const formattedResponse: Note[] = response.map((n) => {
		n.creationTime = new Date(Date.parse(n.creationTime as string));
		return n as Note;
	});
	return formattedResponse;
}
