export function formatDate(date: string): string {
  const milliseconds = Date.now() - new Date(date).getTime();

  const seconds = milliseconds / 1_000;
  if (seconds < 1) {
    return floorAndPluralize(milliseconds, "millisecond") + " ago";
  }

  const minutes = seconds / 60;
  if (minutes < 1) {
    return floorAndPluralize(seconds, "second") + " ago";
  }

  const hours = minutes / 60;
  if (hours < 1) {
    return floorAndPluralize(minutes, "minute") + " ago";
  }

  const days = hours / 24;
  if (days < 1) {
    return floorAndPluralize(hours, "hour") + " ago";
  }

  const months = days / 30; // roughly
  if (months < 1) {
    return floorAndPluralize(days, "day") + " ago";
  }

  const years = months / 12;
  if (years < 1) {
    return floorAndPluralize(months, "month") + " ago";
  }

  return floorAndPluralize(years, "year") + " ago";
}

function floorAndPluralize(value: number, singular: string) {
  const floor = Math.floor(value);
  let string = floor.toLocaleString() + " " + singular;
  if (floor !== 1) {
    string += "s";
  }
  return string;
}
