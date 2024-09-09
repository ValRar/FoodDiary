"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout() {
	cookies()
		.getAll()
		.forEach((c) => cookies().delete(c.name));
	redirect("/");
}
