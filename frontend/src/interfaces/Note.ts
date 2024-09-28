import NoteEntry from "./NoteEntry";

export interface NoteResponse {
  id: number;
  entries: NoteEntry[];
  creationTime: string | Date;
}
export interface Note {
  id: number;
  entries: NoteEntry[];
  creationTime: Date;
}
