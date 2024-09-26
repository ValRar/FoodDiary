"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout() {
  cookies()
    .getAll()
    .forEach((c) => {
      if (c.name !== "show_dark") cookies().delete(c.name);
    });
  redirect("/");
}
