import React from "react";
import BackgroundFiller from "./BackgroundFiller";
import Image from "next/image";
import Note from "@/interfaces/Note";
import TextButton from "./TextButton";

export default function NoteCard({
	note,
	disabled,
	className,
}: {
	note: Note;
	disabled: boolean;
	className?: string;
}) {
	function displayDate(date: Date): string {
		let minutes = date.getMinutes().toString();
		minutes = minutes.length == 2 ? minutes : "0" + minutes;
		let hours = date.getHours().toString();
		hours = hours.length == 2 ? hours : "0" + hours;
		return hours + ":" + minutes;
	}

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
					<TextButton disabled={disabled}>
						<span className="text-xl font-bold">Изменить</span>
					</TextButton>
					<span className="font-light"> | </span>
					<TextButton disabled={disabled}>
						<span className="text-xl font-bold">Удалить</span>
					</TextButton>
				</div>
			</BackgroundFiller>
		</div>
	);
}
