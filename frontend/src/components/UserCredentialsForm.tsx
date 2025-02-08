"use client";

import React, { useState } from "react";
import LightBackgroundFiller from "./LightBackgroundFiller";
import Button from "./Button";
import { useFormState } from "react-dom";
import OpenedEyeIcon from "./svg/OpenedEyeIcon";
import ClosedEyeIcon from "./svg/ClosedEyeIcon";

const initialState = {
  message: "",
};

export default function UserCredentialsForm({
  onSubmit,
}: {
  onSubmit: (
    prevState: any,
    formData: FormData
  ) => Promise<{ message: string }>;
}) {
  const [state, loginAction] = useFormState(onSubmit, initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <form className="flex items-center flex-col w-11/12" action={loginAction}>
      <section className="w-full max-w-md">
        <span className="ml-4">Адрес электронной почты</span>
        <LightBackgroundFiller className="w-full !p-2 relative">
          <input
            name="email"
            type="email"
            className="bg-transparent outline-none w-full"
          ></input>
        </LightBackgroundFiller>
      </section>
      <section className="w-full max-w-md mb-2">
        <span className="ml-4">Пароль</span>
        <div className="flex items-center">
          <LightBackgroundFiller className="w-full !p-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="bg-transparent outline-none w-full"
            ></input>
          </LightBackgroundFiller>
          <div
            className="h-auto w-auto ml-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            <LightBackgroundFiller className="!p-2 interactive-button cursor-pointer">
              {showPassword ? (
                <ClosedEyeIcon className="svg h-6 w-6" />
              ) : (
                <OpenedEyeIcon className="svg h-6 w-6" />
              )}
            </LightBackgroundFiller>
          </div>
        </div>
      </section>
      <Button type="submit" className="font-bold text-2xl my-2">
        <span>Авторизоваться</span>
      </Button>
      {state?.message && <span>{state.message}</span>}
    </form>
  );
}
