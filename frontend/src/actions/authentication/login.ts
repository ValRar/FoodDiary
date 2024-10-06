"use server";

import { redirect } from "next/navigation";
import {
  BASE_URL,
  cookieSettings,
  JWT_NAME,
  REFRESH_TOKEN_NAME,
} from "../constants";
import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import TokenResponse from "@/interfaces/TokenResponse";
import { cookies } from "next/headers";

export default async function login(prevState: any, data: FormData) {
  const email = data.get("email");
  const password = data.get("password");
  if (email && password) {
    const content = JSON.stringify({ email, password });
    const request = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: content,
    });
    if (!request.ok) {
      return { message: "Пользователь не найден." };
    }
    const response: TokenResponse = await request.json();
    const refreshToken = request.headers
      .getSetCookie()
      .map(parseCookie)
      .find((c) => c.has(REFRESH_TOKEN_NAME))
      ?.get(REFRESH_TOKEN_NAME);
    cookies().set(
      JWT_NAME,
      response.token,
      cookieSettings(new Date(response.expires))
    );
    const refreshExpirationDate = new Date(Date.now());
    refreshExpirationDate.setDate(refreshExpirationDate.getDate() + 1);
    cookies().set(
      REFRESH_TOKEN_NAME,
      refreshToken!,
      cookieSettings(refreshExpirationDate)
    );
    redirect("/home");
  } else {
    return { message: "Введите все необходимые данные." };
  }
}
