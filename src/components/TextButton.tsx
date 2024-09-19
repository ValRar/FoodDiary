"use client";
import React from "react";
import styles from "@/css/textButton.module.css";

export default function TextButton({
  children,
  onClick,
  disabled = false,
  className,
}: {
  children: React.ReactElement;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={
        styles.container +
        (disabled ? "" : " " + styles.enabled) +
        (className ? " " + className : "")
      }
      onClick={disabled ? undefined : onClick}
    >
      {children}
      <div className={styles.underline}></div>
    </button>
  );
}
