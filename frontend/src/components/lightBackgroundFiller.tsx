import React from "react";
import styles from "@/css/BackgroundFiller.module.css";

export default function LightBackgroundFiller({
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
        styles["filler-light"] +
        (className ? " " + className : "")
      }
    >
      {children}
    </div>
  );
}
