import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import React from "react";
import BackgroundFiller from "./BackgroundFiller";

export default function NoteDeletionModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Подтвердите действие</ModalHeader>
            <ModalBody>
              Вы действительно хотите удалить данную запись?
            </ModalBody>
            <ModalFooter>
              <BackgroundFiller className="!p-3 hover:scale-105 active:scale-95 transition-transform duration-100">
                <button onClick={onConfirm}>Удалить</button>
              </BackgroundFiller>
              <button
                onClick={onClose}
                className="hover:scale-105 active:scale-95 transition-transform duration-100"
              >
                Отмена
              </button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
