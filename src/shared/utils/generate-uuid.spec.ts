import { generateUUID } from './generate-uuid';
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('generateUUID', () => {
  it('should return a valid UUID', () => {
    const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
    (randomUUID as jest.Mock).mockReturnValue(mockUUID);

    const result = generateUUID();

    expect(result).toBe(mockUUID);
    expect(result).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});
