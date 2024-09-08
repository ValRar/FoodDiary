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
		request.cookies.has(REFRESH_TOKEN_NAME)
	) {
		const tokens = await updateToken();
		if (!tokens) redirect("/");
		request.headers
			.getSetCookie()
			.push(`${JWT_NAME}=${tokens?.tokenResponse.token}`);
		request.cookies.set(JWT_NAME, tokens?.tokenResponse.token);
		request.cookies.set(REFRESH_TOKEN_NAME, tokens.refreshToken);

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
	}
	return NextResponse.next();
}

export const config = {
	matcher: "/home",
};
