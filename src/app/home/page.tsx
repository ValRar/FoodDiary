import getNotesPage from "@/actions/notes/getNotesPage";
import { REFRESH_TOKEN_NAME } from "@/actions/constants";
import Logo from "@/components/Logo";
import NotesView from "@/components/NotesView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function HomePage() {
	if (!cookies().has(REFRESH_TOKEN_NAME)) return redirect("/");
	const notes = await getNotesPage({ page: 1, pageSize: 10 });
	return (
		<>
			<label className="w-fit absolute top-4 left-4">
				<Logo></Logo>
			</label>
			<div className="mx-96">
				<NotesView notes={notes}></NotesView>
			</div>
		</>
	);
}
