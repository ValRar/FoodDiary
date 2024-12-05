import React from "react";
import UserCredentialsForm from "@/components/UserCredentialsForm";
import login from "@/actions/authentication/login";
import FormHeader from "@/components/FormHeader";

export default function LoginPage() {
  return (
    <>
      <FormHeader></FormHeader>
      <div className="flex justify-center items-center flex-col min-h-screen w-screen pt-28">
        <span className="font-bold md:text-4xl text-3xl mb-3">
          Вход в аккаунт
        </span>
        <UserCredentialsForm onSubmit={login} />
      </div>
    </>
  );
}
