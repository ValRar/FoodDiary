"use server";

import { redirect } from "next/navigation";
import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import TokenResponse from "@/interfaces/TokenResponse";
import { cookies } from "next/headers";
import { cookieSettings, JWT_NAME, REFRESH_TOKEN_NAME } from "../constants";

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
    const response: TokenResponse = await request.json();
    const refreshToken = request.headers
      .getSetCookie()
      .map(parseCookie)
      .find((c) => c.has("refresh_token"))
      ?.get("refresh_token");
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
