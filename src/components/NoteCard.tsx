import React from "react";
import BackgroundFiller from "./BackgroundFiller";
import Image from "next/image";
import { Note } from "@/interfaces/Note";
import TextButton from "./TextButton";
import Link from "next/link";
import { displayDate } from "./utilities";

export default function NoteCard({
	note,
	disabled = false,
	className,
}: {
	note: Note;
	disabled?: boolean;
	className?: string;
}) {
	return (
		<div className={className}>
			<BackgroundFiller>
				<div className="flex">
					<span className="font-bold text-xl ml-2 mr-1">
						{displayDate(note.creationTime)}
					</span>
					<Image height={24} width={24} src="/clock.svg" alt="clock icon" />
				</div>
				<div className="my-2">
					{note.entries.map((e) => (
						<span key={e.id} className="block text-xl">
							<span className="font-bold">· </span>
							<span>{e.dish}</span>
							{e.calories && (
								<>
									<span className="font-light"> | </span>
									<span className="text-base">{`${e.calories} ккал`}</span>
								</>
							)}
						</span>
					))}
				</div>
				<div className="mx-2">
					<Link href={`/note/${note.id}/edit`}>
						<TextButton disabled={disabled}>
							<span className="text-xl font-bold">Изменить</span>
						</TextButton>
					</Link>

					<span className="font-light"> | </span>
					<TextButton disabled={disabled}>
						<span className="text-xl font-bold">Удалить</span>
					</TextButton>
				</div>
			</BackgroundFiller>
		</div>
	);
}
