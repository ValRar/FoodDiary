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
		<div>
			<span className="font-bold text-3xl">{`${dayToString(
				dayOfWeek
			)}, ${monthToString(month)} ${dayOfMonth}, ${year}`}</span>
			<span className="text-3xl"> | </span>
			<span className="text-3xl">{`${caloriesSum} ккал`}</span>
		</div>
	);
}
