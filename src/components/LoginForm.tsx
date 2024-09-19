"use client";

import React from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Button from "./Button";
import { useFormState } from "react-dom";
import login from "@/actions/authentication/login";

const initialState = {
  message: "",
};

export default function LoginForm() {
  const [state, loginAction] = useFormState(login, initialState);
  return (
    <form className="flex items-center flex-col w-11/12" action={loginAction}>
      <div className="w-full">
        <span className="ml-4">Адрес электронной почты</span>
        <LightBackgroundFiller className="w-full !p-2 max-w-screen-md">
          <input
            name="email"
            type="email"
            className="bg-transparent outline-none max-w-96 w-full"
          ></input>
        </LightBackgroundFiller>
      </div>
      <div className="w-full">
        <span className="ml-4">Пароль</span>
        <LightBackgroundFiller className="w-full !p-2 mb-2">
          <input
            name="password"
            type="password"
            className="bg-transparent outline-none max-w-96 w-full"
          ></input>
        </LightBackgroundFiller>
      </div>
      <Button type="submit" className="font-bold text-2xl my-2">
        <span>Войти</span>
      </Button>
      {state?.message && <span>{state.message}</span>}
    </form>
  );
}
