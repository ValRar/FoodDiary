import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../css/globals.css";
import { NextUIProvider } from "@nextui-org/system";
import { cookies } from "next/headers";
import Script from "next/script";
import { DARK_THEME_COOKIE_NAME } from "@/actions/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Diary",
  description: "Food diary for people who want to monitor their diet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let showDarkmode = false;
  const themeCookie = cookies().get(DARK_THEME_COOKIE_NAME);
  if (themeCookie && themeCookie.value === "1") showDarkmode = true;
  return (
    <html lang="ru" className={"h-full" + (showDarkmode ? " dark" : "")}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={
          inter.className +
          " min-w-full min-h-screen text-green-text bg-green-background dark:text-green-dark-text dark:bg-green-dark-background"
        }
      >
        <NextUIProvider>{children}</NextUIProvider>
        <Script src="/scripts/detectColorTheme.js"></Script>
      </body>
    </html>
  );
}
