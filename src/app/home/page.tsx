import {
  DISPLAY_NAME_COOKIE_NAME,
  REFRESH_TOKEN_NAME,
} from "@/actions/constants";
import getNotesPage from "@/actions/notes/getNotesPage";
import HomeClientSide from "@/components/HomeClientSide";
import LightBackgroundFiller from "@/components/LightBackgroundFiller";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  if (!cookies().has(REFRESH_TOKEN_NAME)) return redirect("/");
  const notes = await getNotesPage(new Date(Date.now()));
  const displayName = cookies().get(DISPLAY_NAME_COOKIE_NAME)?.value;
  return (
    <main>
      <label className="w-fit hidden xl:block fixed top-4 left-4">
        <Logo></Logo>
      </label>
      <div className="w-fit fixed top-4 right-4 md:flex items-center hidden">
        {displayName && (
          <LightBackgroundFiller className="w-fit !py-6 hidden xl:block">
            <span className="text-xl">{displayName}</span>
          </LightBackgroundFiller>
        )}
        <LogoutButton></LogoutButton>
      </div>
      <HomeClientSide notes={notes}></HomeClientSide>
    </main>
  );
}
