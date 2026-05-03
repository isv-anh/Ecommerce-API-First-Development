/**
 * Parse sort query string into Prisma-compatible orderBy array.
 *
 * @example
 * parseSort("name:asc,createdAt:desc")
 * // => [{ name: "asc" }, { createdAt: "desc" }]
 *
 * @param sort - Sort string in format "field:direction,field2:direction"
 * @returns Array of orderBy objects for Prisma
 *
 */
export const parseSort = (sort?: string) => {
  if (!sort) return [];

  return sort.split(',').map((item) => {
    const [field, direction] = item.split(':');

    return {
      [field]: direction === 'desc' ? 'desc' : 'asc',
    };
  });
};
