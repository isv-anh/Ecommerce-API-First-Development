import type { GridSortModel } from "@mui/x-data-grid";

export const parseSort = (sort?: string) => {
  if (!sort) return [];

  return sort
    .split(",")
    .filter(Boolean)
    .map((item) => {
      const [field, direction] = item.split(":");

      return {
        [field]: direction === "desc" ? "desc" : "asc",
      };
    });
};

export const parseSortModel = (sortString?: string): GridSortModel => {
  if (!sortString) return [];

  return sortString
    .split(",")
    .filter(Boolean)
    .map((item) => {
      const [field, direction] = item.split(":");

      return {
        field,
        sort: direction === "desc" ? "desc" : "asc",
      };
    });
};
