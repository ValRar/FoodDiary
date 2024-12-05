import register from "@/actions/authentication/register";
import UserCredentialsForm from "@/components/UserCredentialsForm";
import React from "react";
import FormHeader from "@/components/FormHeader";

export default function LoginPage() {
  return (
    <>
      <FormHeader></FormHeader>
      <div className="flex justify-center items-center flex-col min-h-screen pt-28">
        <span className="font-bold md:text-4xl text-3xl mb-3">Регистрация</span>
        <UserCredentialsForm onSubmit={register} />
      </div>
    </>
  );
}
