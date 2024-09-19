"use server";

import { cookies } from "next/headers";
import { BASE_URL, JWT_NAME } from "../constants";

export default async function calculateCalories(
  dish: string
): Promise<number | undefined> {
  const token = cookies().get(JWT_NAME)?.value;
  try {
    const request = await fetch(
      `${BASE_URL}/calories/calculate?dishes=${dish}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!request.ok) {
      return;
    }
    const { calories }: { calories: number } = await request.json();
    return calories;
  } catch {
    return;
  }
}
