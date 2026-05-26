import type { SelectOption } from "@/components/inputs/MultiSelect/BaseMultiSelect/types";
import type { SingleSelectProps } from "@/components/inputs/SingleSelect/types";
import type { QueryKey } from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";

export type ServerSingleSelectProps<
  TField extends FieldValues,
  TData = unknown,
> = Omit<
  SingleSelectProps<TField>,
  | "options"
  | "mode"
  | "search"
  | "onSearchChange"
  | "onLoadMore"
  | "isLoadMore"
  | "loading"
> & {
  queryKey: QueryKey;
  queryFn: (params: { pageParam: number; search: string }) => Promise<TData>;
  getNextPageParam: (lastPage: TData, allPages: TData[]) => number | undefined;
  select: (page: TData) => {
    data: SelectOption[];
  };
};
