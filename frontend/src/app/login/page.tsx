import Logo from "@/components/Logo";
import React from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <label className="w-fit absolute top-4 left-4">
        <Logo></Logo>
      </label>
      <div className="flex justify-center items-center flex-col min-h-screen w-screen pt-28">
        <span className="font-bold md:text-4xl text-3xl mb-3">
          Вход в аккаунт
        </span>
        <LoginForm></LoginForm>
      </div>
    </>
  );
}
