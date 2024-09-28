"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DARK_THEME_COOKIE_NAME } from "../constants";

export default async function logout() {
  cookies()
    .getAll()
    .forEach((c) => {
      if (c.name !== DARK_THEME_COOKIE_NAME) cookies().delete(c.name);
    });
  redirect("/");
}
