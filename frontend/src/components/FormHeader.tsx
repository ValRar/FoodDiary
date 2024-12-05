import React from "react";
import ReturnButton from "./ReturnButton";
import Logo from "./Logo";

export default function FormHeader() {
  return (
    <section className="w-fit absolute top-4 left-4 flex flex-row items-center">
      <ReturnButton></ReturnButton>
      <Logo></Logo>
    </section>
  );
}
