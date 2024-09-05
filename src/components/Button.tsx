import React from "react";
import styles from "@/css/Button.module.css";

export default function Button({
	children,
	onClick,
	className,
}: {
	children: React.ReactElement;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	className?: string;
}) {
	return (
		<button onClick={onClick} className={className}>
			<div className={styles["background-filler"]}>{children}</div>
		</button>
	);
}
