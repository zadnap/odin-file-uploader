const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const pluralize = (value, unit) =>
  value === 1 ? `${value} ${unit} ago` : `${value} ${unit}s ago`;

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const now = new Date();

  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (isSameDay(date, now)) {
    if (diffSeconds < 10) return 'now';
    if (diffSeconds < 60) return pluralize(diffSeconds, 'second');
    if (diffMinutes < 60) return pluralize(diffMinutes, 'minute');
    return pluralize(diffHours, 'hour');
  }

  if (date.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export { formatDate };
