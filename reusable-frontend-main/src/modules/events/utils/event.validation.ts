export const toValidIsoDate = (value: string): string | null => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const isValidEventRange = (start: string, end: string): boolean => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Number.isFinite(startDate.getTime()) && Number.isFinite(endDate.getTime()) && endDate.getTime() > startDate.getTime();
};
