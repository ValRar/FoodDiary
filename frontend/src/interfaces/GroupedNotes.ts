import { Note } from "./Note";

export default interface GroupedNotes {
	dayOfWeek: number;
	dayOfMonth: number;
	month: number;
	year: number;
	caloriesSum: number;
	notes: Note[];
}
