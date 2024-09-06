"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const baseUrl = process.env.BACKEND_BASE_URL;

export default async function register(prevState: any, data: FormData) {
	const email = data.get("email");
	const password = data.get("password");
	if (email && password) {
		const content = JSON.stringify({ email, password });
		const request = await fetch(`${baseUrl}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: content,
		});
		if (!request.ok) {
			return { message: "Пользователь с таким email уже существует." };
		}
		const response: { token: string; expires: string } = await request.json();
		cookies().set("token", response.token, {
			httpOnly: true,
			expires: new Date(Date.parse(response.expires)),
		});
		redirect("/home");
	} else {
		return { message: "Введите все необходимые данные." };
	}
}
