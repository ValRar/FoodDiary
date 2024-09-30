"use client";
import React from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Image from "next/image";
import ExitImage from "../../public/exit.svg";
import logout from "@/actions/authentication/logout";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import BackgroundFiller from "./BackgroundFiller";

export default function LogoutButton({ className }: { className?: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button onClick={onOpen} className={className}>
        <LightBackgroundFiller className="!p-5 cursor-pointer !bg-[#51e64e] md:!bg-[#04db00]/[0.15]">
          <Image
            src={ExitImage}
            alt="exit icon"
            width={40}
            height={40}
            className="svg"
          ></Image>
        </LightBackgroundFiller>
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Подтвердите действие</ModalHeader>
              <ModalBody>Вы уверены, что хотите выйти из аккаунта?</ModalBody>
              <ModalFooter>
                <BackgroundFiller className="!p-3 hover:scale-105 active:scale-95 transition-transform duration-100">
                  <button onClick={() => logout()}>Выйти</button>
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
    </>
  );
}
