import Logo from "@/components/Logo";
import React from "react";
import RegisterForm from "@/components/RegisterForm";

export default function LoginPage() {
  return (
    <>
      <label className="w-fit absolute top-4 left-4">
        <Logo></Logo>
      </label>
      <div className="flex justify-center items-center flex-col min-h-screen">
        <span className="font-bold md:text-4xl text-3xl mb-3">Регистрация</span>
        <RegisterForm></RegisterForm>
      </div>
    </>
  );
}
