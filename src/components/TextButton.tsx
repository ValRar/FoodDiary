"use client";
import React from "react";
import styles from "@/css/textButton.module.css";

export default function TextButton({
	children,
	onClick,
	disabled = false,
}: {
	children: React.ReactElement;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled: boolean;
}) {
	return (
		<button
			className={styles.container + (disabled ? "" : " " + styles.enabled)}
			onClick={disabled ? onClick : undefined}
		>
			{children}
			<div className={styles.underline}></div>
		</button>
	);
}
