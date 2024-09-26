import React from "react";
import styles from "../css/backgroundFiller.module.css";

export default function BackgroundFiller({
  children,
  className,
}: {
  children: React.ReactElement[] | React.ReactElement;
  className?: string;
}) {
  return (
    <div
      className={
        styles.filler +
        " dark:!filter-none " +
        styles["filler-regular"] +
        (className ? " " + className : "")
      }
    >
      {children}
    </div>
  );
}
