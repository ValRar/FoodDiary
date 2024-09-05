import Button from "@/components/Button";
import Logo from "@/components/Logo";
import NoteCard from "@/components/NoteCard";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
	weight: "400",
	display: "swap",
	subsets: ["cyrillic"],
});

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-start p-4 px-96">
			<Logo />
			<div className={pacifico.className + " text-3xl my-10"}>
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
					disabled={false}
				></NoteCard>
				<nav className="py-8 flex justify-center">
					<Button className="mx-3 grow">
						<span className="text-3xl">Вход</span>
					</Button>
					<Button className="shrink">
						<span className="text-3xl">Регистрация</span>
					</Button>
				</nav>
			</section>
		</main>
	);
}
