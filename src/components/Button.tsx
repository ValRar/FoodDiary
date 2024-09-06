import React from "react";
import styles from "@/css/Button.module.css";

export default function Button({
	children,
	onClick,
	className,
	type,
}: {
	children: React.ReactElement;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	className?: string;
	type?: "submit" | "reset" | "button";
}) {
	return (
		<button onClick={onClick} type={type} className={className}>
			<div className={styles["background-filler"]}>{children}</div>
		</button>
	);
}
