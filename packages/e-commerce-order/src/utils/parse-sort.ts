type SortDirection = 'asc' | 'desc';

type SortMapValue = string | ((direction: SortDirection) => object);

export type SortMap = Record<string, SortMapValue>;

export const parseSort = (sort?: string, sortMap: SortMap = {}) => {
  if (!sort) return [];

  return sort
    .split(',')
    .filter(Boolean)
    .flatMap((item) => {
      const [field, rawDirection] = item.split(':');

      const mappedField = sortMap[field] ?? field;

      const direction: SortDirection = rawDirection === 'desc' ? 'desc' : 'asc';

      if (typeof mappedField === 'string') {
        return [
          {
            [mappedField]: direction,
          },
        ];
      }

      return [mappedField(direction)];
    });
};
