"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import BackgroundFiller from "./BackgroundFiller";
import EditableRow from "./EditableRow";
import { displayDate } from "./utilities";
import NoteEntry from "@/interfaces/NoteEntry";
import TextButton from "./TextButton";
import LightBackgroundFiller from "./LightBackgroundFiller";
import calculateCalories from "@/actions/notes/calculateCalories";

export default function NoteCreatingForm() {
	const [entries, setEntries] = useState<NoteEntry[]>([{ id: 0, dish: "" }]);
	function handleDishChange(input: string, id: number) {
		setEntries(
			entries.map((e) => {
				if (e.id !== id) return e;
				return {
					...e,
					dish: input,
				};
			})
		);
	}
	function handleCaloriesChange(input: string, id: number) {
		setEntries(
			entries.map((e) => {
				if (e.id !== id) return e;
				return {
					...e,
					calories: parseCalories(input),
				};
			})
		);
	}
	function addRow() {
		setEntries([...entries, { dish: "", id: entries.length }]);
	}
	function removeRow(id: number) {
		setEntries(entries.filter((e) => e.id !== id));
	}
	function parseCalories(value: string): number | undefined {
		try {
			return parseInt(value);
		} catch {
			return;
		}
	}
	function caloriesToString(value?: number): string {
		return value ? value.toString() : "";
	}
	useEffect(() => {
		console.log(entries);
	}, [entries]);
	return (
		<div className="pr-40">
			<BackgroundFiller>
				<div className="flex">
					<span className="font-bold text-xl ml-2 mr-1">
						{displayDate(new Date(Date.now()))}
					</span>
					<Image height={24} width={24} src="/clock.svg" alt="clock icon" />
				</div>
				<div className="my-2">
					{entries.map((e) => (
						<div key={e.id} className="my-6">
							<section className="absolute -right-28 flex">
								<label
									onClick={() => removeRow(e.id)}
									className="mr-2 cursor-pointer"
								>
									<LightBackgroundFiller className="!p-2">
										<Image
											src="/trash_bin.svg"
											alt="trash bin"
											height={30}
											width={30}
										></Image>
									</LightBackgroundFiller>
								</label>
								<label
									className="cursor-pointer"
									onClick={async () => {
										console.log(entries);
										const calories = await calculateCalories(e.dish);
										console.log(calories);
										handleCaloriesChange(
											calories?.toString() ?? e.calories?.toString() ?? "",
											e.id
										);
										const input = document.querySelector(
											`#calories-input${e.id}`
										);
										if (input) {
											input.textContent = caloriesToString(calories);
										}
									}}
								>
									<LightBackgroundFiller className="!p-2">
										<Image
											src="/magic_stick.svg"
											alt="magic stick"
											height={30}
											width={30}
										></Image>
									</LightBackgroundFiller>
								</label>
							</section>
							<span className="font-bold">· </span>
							<EditableRow
								placeholder="Введите блюдо"
								onInput={(t) => handleDishChange(t, e.id)}
								className="text-xl"
							></EditableRow>
							<span> | </span>
							<EditableRow
								id={`calories-input${e.id}`}
								placeholder="Введите кол-во калорий (в ккал)"
								onInput={(t) => handleCaloriesChange(t, e.id)}
								onEnterPress={addRow}
								className="text-xl"
							></EditableRow>
						</div>
					))}
				</div>
				<div className="mx-2">
					<TextButton
						onClick={(e) => {
							addRow();
						}}
					>
						<span className="text-xl font-bold">Добавить</span>
					</TextButton>
				</div>
			</BackgroundFiller>
		</div>
	);
}
