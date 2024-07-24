export function checkIfDelayed(
  endDate: Date,
  completionPercentage: number,
): boolean {
  const currentDate = new Date();
  const dueDate = new Date(endDate);
  return currentDate > dueDate && completionPercentage < 100;
}
