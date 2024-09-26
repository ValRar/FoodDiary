"use client";
import { Note } from "@/interfaces/Note";
import { useDisclosure } from "@nextui-org/modal";
import Image from "next/image";
import BackgroundFiller from "./BackgroundFiller";
import TextButton from "./TextButton";
import { displayDate } from "./utilities";
import NoteDeletionModal from "./NoteDeletionModal";
export default function NoteCard({
  note,
  disabled = false,
  className,
  onClickDelete,
  onClickUpdate,
}: {
  note: Note;
  disabled?: boolean;
  className?: string;
  onClickDelete?: (noteId: number) => void;
  onClickUpdate?: (noteId: number) => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className={className}>
      <NoteDeletionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => (onClickDelete ? onClickDelete(note.id) : undefined)}
      ></NoteDeletionModal>
      <BackgroundFiller>
        <div className="flex">
          <span className="font-bold md:text-xl ml-2 mr-1">
            {displayDate(note.creationTime)}
          </span>
          <Image
            height={24}
            width={24}
            src="/clock.svg"
            alt="clock icon"
            className="svg"
          />
        </div>
        <div className="md:my-2 my-1">
          {note.entries.map((e) => (
            <span key={e.id} className="block md:text-xl">
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
          <TextButton
            disabled={disabled}
            onClick={onClickUpdate ? () => onClickUpdate(note.id) : undefined}
          >
            <span className="md:text-xl font-bold">Изменить</span>
          </TextButton>

          <span className="font-light"> | </span>
          <TextButton disabled={disabled} onClick={onOpen}>
            <span className="md:text-xl font-bold">Удалить</span>
          </TextButton>
        </div>
      </BackgroundFiller>
    </div>
  );
}
