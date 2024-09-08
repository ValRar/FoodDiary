import NoteResponse from "@/interfaces/Note";
import { BASE_URL, JWT_NAME } from "../constants";
import { cookies } from "next/headers";

export default async function getNote(id: number): Promise<NoteResponse> {
	const token = cookies().get(JWT_NAME)?.value;
	const request = await fetch(`${BASE_URL}/notes/${id}`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	});
	const response: NoteResponse = await request.json();
	return response;
}
