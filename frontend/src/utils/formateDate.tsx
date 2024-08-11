function formatDate(sdate: string) {
  const date = new Date(sdate.slice(0, 19));
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const weekDay = date.toLocaleString("default", { weekday: "short" });
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Adjust startOfWeek for weeks starting on Monday
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (now.getDay() || 7) + 1); // set to previous Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // set to next Sunday

  if (date.toDateString() === now.toDateString()) {
    return `Today, ${hours}:${minutes}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${hours}:${minutes}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${hours}:${minutes}`;
  } else if (date >= startOfWeek && date <= endOfWeek) {
    return `${weekDay}, ${hours}:${minutes}`;
  } else if (date.getFullYear() === now.getFullYear()) {
    return `${day} ${month}, ${hours}:${minutes}`;
  } else {
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }
}

export default formatDate;
