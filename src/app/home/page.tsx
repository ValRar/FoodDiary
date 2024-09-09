import getNotesPage from "@/actions/notes/getNotesPage";
import {
	DISPLAY_NAME_COOKIE_NAME,
	REFRESH_TOKEN_NAME,
} from "@/actions/constants";
import Logo from "@/components/Logo";
import NotesView from "@/components/NotesView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import LightBackgroundFiller from "@/components/LightBackgroundFiller";
import LogoutButton from "@/components/LogoutButton";

export default async function HomePage() {
	if (!cookies().has(REFRESH_TOKEN_NAME)) return redirect("/");
	const notes = await getNotesPage({ page: 1, pageSize: 10 });
	const displayName = cookies().get(DISPLAY_NAME_COOKIE_NAME)?.value;
	return (
		<>
			<label className="w-fit fixed top-4 left-4">
				<Logo></Logo>
			</label>
			<div className="w-fit fixed top-4 right-4 flex items-center">
				{displayName && (
					<LightBackgroundFiller className="w-fit !py-6">
						<span className="text-xl">{displayName}</span>
					</LightBackgroundFiller>
				)}
				<LogoutButton></LogoutButton>
			</div>
			<div className="mx-96 mt-4">
				<NotesView notes={notes}></NotesView>
			</div>
		</>
	);
}
