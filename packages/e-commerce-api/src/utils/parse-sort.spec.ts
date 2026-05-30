import { parseSort } from './parse-sort';

describe('parseSort', () => {
  const sortMap = {
    name: 'name',
    createdAt: 'createdAt',
  };

  it('should return empty array when sort is undefined', () => {
    expect(parseSort(undefined)).toEqual([]);
  });

  it('should return empty array when sort is empty string', () => {
    expect(parseSort('')).toEqual([]);
  });

  it('should parse single sort field asc', () => {
    expect(parseSort('name:asc', sortMap)).toEqual([{ name: 'asc' }]);
  });

  it('should parse single sort field desc', () => {
    expect(parseSort('createdAt:desc', sortMap)).toEqual([
      { createdAt: 'desc' },
    ]);
  });

  it('should default to asc when direction is invalid', () => {
    expect(parseSort('name:invalid', sortMap)).toEqual([{ name: 'asc' }]);
  });

  it('should default to asc when direction is missing', () => {
    expect(parseSort('name', sortMap)).toEqual([{ name: 'asc' }]);
  });

  it('should parse multiple fields', () => {
    expect(parseSort('name:asc,createdAt:desc', sortMap)).toEqual([
      { name: 'asc' },
      { createdAt: 'desc' },
    ]);
  });

  it('should handle extra commas gracefully', () => {
    expect(parseSort('name:asc,,createdAt:desc', sortMap)).toEqual([
      { name: 'asc' },
      { createdAt: 'desc' },
    ]);
  });

  it('should use raw field when sortMap is not provided', () => {
    expect(parseSort('name:asc')).toEqual([{ name: 'asc' }]);
  });

  it('should support function mapper', () => {
    const customSortMap = {
      parentName: (direction: 'asc' | 'desc') => ({
        parent: {
          name: direction,
        },
      }),
    };

    expect(parseSort('parentName:desc', customSortMap)).toEqual([
      {
        parent: {
          name: 'desc',
        },
      },
    ]);
  });

  it('should pass asc direction into function mapper by default', () => {
    const mapper = jest.fn((direction: 'asc' | 'desc') => ({
      parent: {
        name: direction,
      },
    }));

    parseSort('parentName', {
      parentName: mapper,
    });

    expect(mapper).toHaveBeenCalledWith('asc');
  });
});
