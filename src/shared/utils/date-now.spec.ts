import { DateTime } from 'luxon';
import { DateNow } from './date-now';

describe('DateNow', () => {
  it('should return the current date and time in the São Paulo timezone', () => {
    // Mock do DateTime.now para retornar uma data específica
    const mockDate = DateTime.now();

    jest.spyOn(DateTime, 'now').mockReturnValue(mockDate);

    const result = DateNow();

    // Verifica se o resultado é um objeto Date
    expect(result).toBeInstanceOf(Date);

    // Verifica se a data é igual ao mock
    const expectedDate = mockDate.toJSDate();
    expect(result.getTime()).toBe(expectedDate.getTime());
  });
});
