"use client";

import React from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Button from "./Button";
import { useFormState } from "react-dom";
import register from "@/actions/authentication/register";

const initialState = {
  message: "",
};

export default function RegisterForm() {
  const [state, registerAction] = useFormState(register, initialState);
  return (
    <form
      className="flex items-center flex-col w-11/12 max-w-md"
      action={registerAction}
    >
      <div className="w-full">
        <span className="ml-4">Адрес электронной почты</span>
        <LightBackgroundFiller className="w-full !p-2">
          <input
            name="email"
            type="email"
            className="bg-transparent outline-none w-full"
          ></input>
        </LightBackgroundFiller>
      </div>
      <div className="w-full">
        <span className="ml-4">Пароль</span>
        <LightBackgroundFiller className="w-full !p-2 mb-2">
          <input
            name="password"
            type="password"
            className="bg-transparent outline-none w-full"
          ></input>
        </LightBackgroundFiller>
      </div>
      <Button type="submit" className="font-bold md:text-2xl my-2">
        <span>Зарегистрироваться</span>
      </Button>
      {state?.message && <span>{state.message}</span>}
    </form>
  );
}
