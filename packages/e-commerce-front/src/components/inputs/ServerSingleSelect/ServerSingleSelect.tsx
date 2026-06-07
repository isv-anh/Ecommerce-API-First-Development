import type { ServerSingleSelectProps } from "@/components/inputs/ServerSingleSelect/types";
import BaseSingleSelect from "@/components/inputs/SingleSelect/BaseSingleSelect/BaseSingleSelect";
import useDebounce from "@/hooks/useDebounce";
import {
  useSuspenseInfiniteQuery,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller, type FieldValues } from "react-hook-form";

const ServerSingleSelect = <TField extends FieldValues, TData = unknown>({
  control,
  name,
  queryKey,
  queryFn,
  getNextPageParam,
  select,
  ...props
}: ServerSingleSelectProps<TField, TData>) => {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useSuspenseInfiniteQuery<
      TData,
      Error,
      InfiniteData<TData>,
      QueryKey,
      number
    >({
      queryKey: [...(queryKey as QueryKey), debouncedSearch],
      queryFn: ({ pageParam }) =>
        queryFn({ pageParam: pageParam as number, search: debouncedSearch }),
      getNextPageParam: (lastPage, allPages) =>
        getNextPageParam(lastPage, allPages),
      initialPageParam: 1,
    });

  const options = useMemo(
    () => data?.pages.flatMap((page) => select(page).data) ?? [],
    [data, select],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <BaseSingleSelect
          {...props}
          field={field}
          name={name}
          fieldError={fieldState.error}
          options={options}
          mode="server"
          search={search}
          onSearchChange={setSearch}
          isLoadMore={hasNextPage}
          onLoadMore={fetchNextPage}
          loading={isFetchingNextPage}
        />
      )}
    />
  );
};

export default ServerSingleSelect;
