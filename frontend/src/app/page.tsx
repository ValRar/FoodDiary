import Button from "@/components/Button";
import Logo from "@/components/Logo";
import NoteCard from "@/components/NoteCard";
import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({
  weight: "400",
  display: "swap",
  subsets: ["cyrillic"],
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 lg:px-96">
      <Logo />
      <div
        className={
          pacifico.className + " md:text-3xl text-2xl md:my-10 mt-3 mb-5"
        }
      >
        Ваш личный дневник питания
      </div>
      <section>
        <NoteCard
          note={{
            creationTime: new Date(Date.now()),
            id: 1,
            entries: [
              {
                dish: "Доступно с любых устройств с установленным браузером",
                id: 1,
              },
              { dish: "Удобное создание записей", id: 2 },
              { dish: "Расчёт калорий и блюд при помощи ИИ", id: 3 },
            ],
          }}
          disabled={true}
        ></NoteCard>
        <nav className="py-8 flex flex-col items-center md:flex-row justify-center">
          <Link
            href="/login"
            className="grow w-full md:w-auto md:mr-3 md:mb-0 mb-2"
          >
            <Button className="w-full">
              <span className="text-3xl">Вход</span>
            </Button>
          </Link>
          <Link href="/register" className="md:shrink w-full md:w-auto">
            <Button className="w-full">
              <span className="text-3xl">Регистрация</span>
            </Button>
          </Link>
        </nav>
      </section>
    </main>
  );
}
