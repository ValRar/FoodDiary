"use client";

import { Note } from "@/interfaces/Note";
import React, { useEffect, useState } from "react";
import NoteCard from "./NoteCard";
import { useInView } from "react-intersection-observer";
import getNotesPage from "@/actions/notes/getNotesPage";
import GroupedNotes from "@/interfaces/GroupedNotes";
import DayHeader from "./DayHeader";

function groupNotes(notes: Note[]): GroupedNotes[] {
	const groupedNotes: GroupedNotes[] = [];
	for (let i = 0; i < notes.length; i++) {
		let group = groupedNotes.find(
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

export default function NotesView({ notes }: { notes: Note[] }) {
	const { ref, inView } = useInView({ threshold: 0.5 });
	const [page, setPage] = useState<number>(2);
	const [isEnd, setIsEnd] = useState<boolean>(false);
	const [notesArr, setNotesArr] = useState<Note[]>(notes);
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
		<>
			<section>
				{groupNotes(notesArr).map((g) => (
					<>
						<DayHeader
							dayOfMonth={g.dayOfMonth}
							dayOfWeek={g.dayOfWeek}
							month={g.month}
							year={g.year}
							caloriesSum={g.caloriesSum}
							key={calculateKey(g.year, g.month, g.dayOfMonth)}
						></DayHeader>
						{g.notes.map((n) => (
							<NoteCard note={n} key={n.id} className="my-5"></NoteCard>
						))}
					</>
				))}
			</section>
			<label ref={ref}></label>
		</>
	);
}
