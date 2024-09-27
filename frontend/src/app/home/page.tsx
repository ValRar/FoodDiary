import { REFRESH_TOKEN_NAME } from "@/actions/constants";
import getNotesPage from "@/actions/notes/getNotesPage";
import HomeClientSide from "@/components/HomeClientSide";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import ThemeChangerDropdown from "@/components/ThemeChangerDropdown";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  if (!cookies().has(REFRESH_TOKEN_NAME)) return redirect("/");
  const notes = await getNotesPage(new Date(Date.now()));
  const showDarkCookie = cookies().get("show_dark");
  const showDark = showDarkCookie ? showDarkCookie.value === "1" : false;
  return (
    <main>
      <label className="w-fit hidden xl:block fixed top-4 left-4">
        <Logo></Logo>
      </label>
      <div className="w-fit fixed top-4 right-3 md:flex items-center hidden">
        <ThemeChangerDropdown showDarkInitial={showDark}></ThemeChangerDropdown>
        <LogoutButton></LogoutButton>
      </div>
      <HomeClientSide notes={notes}></HomeClientSide>
    </main>
  );
}
