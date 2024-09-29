import React from "react";
import { displayDate } from "./utilities";

export default function TimeSpan({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) {
  return <span className={className}>{displayDate(date)}</span>;
}
