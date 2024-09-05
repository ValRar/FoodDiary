import React from "react";
import styles from "../css/backgroundFiller.module.css";

export default function LightBackgroundFiller({
	children,
}: {
	children: React.ReactElement[] | React.ReactElement;
}) {
	return (
		<div className={styles.filler + " " + styles["filler-light"]}>
			{children}
		</div>
	);
}
