export const isRecent = (date: Date, days = 3): boolean => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return false;
  }

  const diffMs = Date.now() - date.getTime();
  const windowMs = days * 24 * 60 * 60 * 1000;
  return diffMs >= 0 && diffMs < windowMs;
};
