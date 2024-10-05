"use server";

import { cookies } from "next/headers";
import { BASE_URL } from "../constants";
import TokenResponse from "@/interfaces/TokenResponse";
import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { REFRESH_TOKEN_NAME } from "../constants";

export default async function updateToken(): Promise<
  { tokenResponse: TokenResponse; refreshToken: string } | undefined
> {
  const refreshToken = cookies().get(REFRESH_TOKEN_NAME);
  if (!refreshToken) {
    return undefined;
  }
  const request = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "GET",
    headers: { Cookie: `${refreshToken.name}=${refreshToken.value}` },
  });
  const newRefreshToken = request.headers
    .getSetCookie()
    .map(parseCookie)
    .find((c) => c.has(REFRESH_TOKEN_NAME))
    ?.get(REFRESH_TOKEN_NAME);
  const response: TokenResponse = await request.json();
  return { tokenResponse: response, refreshToken: newRefreshToken! };
}
