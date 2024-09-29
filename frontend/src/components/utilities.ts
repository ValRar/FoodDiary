export function displayDate(date: Date): string {
  let minutes = date.getMinutes().toString();
  minutes = minutes.length == 2 ? minutes : "0" + minutes;
  let hours = date.getHours().toString();
  hours = hours.length == 2 ? hours : "0" + hours;
  return hours + ":" + minutes;
}
