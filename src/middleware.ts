import updateToken from "@/actions/authentication/updateToken";
import {
  cookieSettings,
  JWT_NAME,
  REFRESH_TOKEN_NAME,
} from "@/actions/constants";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (
    !request.cookies.has(JWT_NAME) &&
    request.cookies.has(REFRESH_TOKEN_NAME) &&
    request.nextUrl.pathname === "/home"
  ) {
    try {
      const tokens = await updateToken();
      if (!tokens) redirect("/");
      // request.cookies.set(JWT_NAME, tokens?.tokenResponse.token);
      // request.cookies.set(REFRESH_TOKEN_NAME, tokens.refreshToken);
      const response = NextResponse.redirect(request.nextUrl);
      response.headers
        .getSetCookie()
        .push(`${JWT_NAME}=${tokens?.tokenResponse.token}`);
      response.cookies.set(
        JWT_NAME,
        tokens?.tokenResponse.token,
        cookieSettings(new Date(tokens.tokenResponse.expires))
      );
      response.cookies.set(
        REFRESH_TOKEN_NAME,
        tokens.refreshToken,
        cookieSettings()
      );
      return response;
    } catch (e) {
      const response = NextResponse.redirect(new URL("/", request.nextUrl));
      request.cookies.getAll().map((c) => response.cookies.delete(c.name));
      return response;
    }
  }
  if (
    request.nextUrl.pathname === "/" &&
    request.cookies.has(REFRESH_TOKEN_NAME)
  ) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  // matcher: "/",
};
