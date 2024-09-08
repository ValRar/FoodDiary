"use client";

import { Note } from "@/interfaces/Note";
import React, { useEffect, useState } from "react";
import NoteCard from "./NoteCard";
import { useInView } from "react-intersection-observer";
import getNotesPage from "@/actions/notes/getNotesPage";

export default function NotesView({ notes }: { notes: Note[] }) {
	const { ref, inView } = useInView({ threshold: 0.5 });
	const [page, setPage] = useState<number>(2);
	const [loading, setLoading] = useState<boolean>(false);
	const [isEnd, setIsEnd] = useState<boolean>(false);
	const [notesArr, setNotesArr] = useState<Note[]>(notes);
	useEffect(() => {
		if (inView && !loading && !isEnd) {
			setLoading(true);
			setPage(page + 1);
			getNotesPage({ page, pageSize: 10 }).then((n) => {
				if (n.length == 0) setIsEnd(true);
				setNotesArr([...notesArr, ...n]);
				setLoading(false);
			});
		}
	}, [inView]);
	return (
		<>
			<section>
				{notesArr.map((n) => (
					<>
						<span>{n.id}</span>
						<NoteCard className="my-5" key={n.id} note={n} />
					</>
				))}
			</section>
			<label ref={ref}></label>
		</>
	);
}
