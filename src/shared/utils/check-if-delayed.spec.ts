import { checkIfDelayed } from './check-if-delayed';

describe('checkIfDelayed', () => {
  it('should return true if the current date is past the end date and completion percentage is less than 100%', () => {
    // Set up a date in the past
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1); // yesterday

    const completionPercentage = 50; // Not 100%

    const result = checkIfDelayed(endDate, completionPercentage);

    expect(result).toBe(true);
  });

  it('should return false if the current date is past the end date but completion percentage is 100%', () => {
    // Set up a date in the past
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1); // yesterday

    const completionPercentage = 100; // Completed

    const result = checkIfDelayed(endDate, completionPercentage);

    expect(result).toBe(false);
  });

  it('should return false if the current date is not past the end date', () => {
    // Set up a date in the future
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1); // tomorrow

    const completionPercentage = 50; // Not 100%

    const result = checkIfDelayed(endDate, completionPercentage);

    expect(result).toBe(false);
  });

  it('should return false if the current date is past the end date but completion percentage is 100%', () => {
    // Set up a date in the future
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1); // yesterday

    const completionPercentage = 100; // Completed

    const result = checkIfDelayed(endDate, completionPercentage);

    expect(result).toBe(false);
  });
});
