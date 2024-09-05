import NoteEntry from "./NoteEntry";

export default interface Note {
	id: number;
	entries: NoteEntry[];
	creationTime: Date;
}
