import { parseSort } from './parse-sort';

describe('parseSort', () => {
  it('should return empty array when sort is undefined', () => {
    expect(parseSort(undefined)).toEqual([]);
  });

  it('should return empty array when sort is empty string', () => {
    expect(parseSort('')).toEqual([]);
  });

  it('should parse single sort field asc', () => {
    expect(parseSort('name:asc')).toEqual([{ name: 'asc' }]);
  });

  it('should parse single sort field desc', () => {
    expect(parseSort('createdAt:desc')).toEqual([{ created_at: 'desc' }]);
  });

  it('should default to asc when direction is invalid', () => {
    expect(parseSort('name:invalid')).toEqual([{ name: 'asc' }]);
  });

  it('should parse multiple fields', () => {
    expect(parseSort('name:asc,createdAt:desc')).toEqual([
      { name: 'asc' },
      { createdAt: 'desc' },
    ]);
  });

  it('should handle missing direction', () => {
    expect(parseSort('name')).toEqual([{ name: 'asc' }]);
  });

  it('should handle extra commas gracefully', () => {
    expect(parseSort('name:asc,,createdAt:desc')).toEqual([
      { name: 'asc' },
      { created_at: 'desc' },
    ]);
  });
});
