import React from "react";

function dayToString(dayOfWeek: number): string {
	const days = [
		"Воскресенье",
		"Понедельник",
		"Вторник",
		"Среда",
		"Четверг",
		"Пятница",
		"Суббота",
	];
	return days[dayOfWeek];
}
function monthToString(month: number): string {
	const months = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь",
	];
	return months[month];
}

export default function DayHeader({
	dayOfMonth,
	dayOfWeek,
	month,
	year,
	caloriesSum,
}: {
	dayOfMonth: number;
	dayOfWeek: number;
	month: number;
	year: number;
	caloriesSum: number;
}) {
	return (
		<h1 className="text-3xl">
			<span className="font-bold">{`${dayToString(dayOfWeek)}, ${monthToString(
				month
			)} ${dayOfMonth}, ${year}`}</span>
			<span> | </span>
			<span>{`${caloriesSum} ккал`}</span>
		</h1>
	);
}
