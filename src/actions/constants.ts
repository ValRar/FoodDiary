import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const JWT_NAME = "token";
export const REFRESH_TOKEN_NAME = "refresh_token";
export const BASE_URL = process.env.BACKEND_BASE_URL;
export function cookieSettings(expires?: Date): Partial<ResponseCookie> {
	return {
		httpOnly: true,
		expires: expires,
		secure: true,
		sameSite: "lax",
	};
}
