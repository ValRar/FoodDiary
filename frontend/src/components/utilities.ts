export function displayDate(date: Date): string {
  let minutes = date.getUTCMinutes().toString();
  minutes = minutes.length == 2 ? minutes : "0" + minutes;
  let hours = date.getUTCHours().toString();
  hours = hours.length == 2 ? hours : "0" + hours;
  return hours + ":" + minutes;
}
