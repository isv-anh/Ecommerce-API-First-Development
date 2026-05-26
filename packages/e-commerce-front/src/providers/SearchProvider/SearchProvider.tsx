"use client";
import type { SearchContextType } from "@/providers/SearchProvider/types";
import {
  parseSearchParams,
  serializeSearchParams,
} from "@/providers/SearchProvider/utils";
import type { createSearchContext } from "@/providers/SearchProvider/utils/context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type ReactNode } from "react";
import type { z } from "zod";

type Props<TSchema extends z.ZodTypeAny> = {
  children: ReactNode;
  schema: TSchema;
  context: ReturnType<typeof createSearchContext<z.infer<TSchema>>>;
};

const SearchProvider = <TSchema extends z.ZodTypeAny>({
  children,
  schema,
  context,
}: Props<TSchema>) => {
  type T = z.infer<TSchema>;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return parseSearchParams(searchParams, schema);
  }, [schema, searchParams]);

  const setSearchParams = useCallback(
    (nextParams: URLSearchParams) => {
      router.replace(`${pathname}?${nextParams.toString()}`);
    },
    [pathname, router],
  );

  const setParams = useCallback(
    (nextValue: Partial<T>) => {
      const next = { ...(params as Record<string, unknown>), ...nextValue };
      setSearchParams(serializeSearchParams(next as Record<string, unknown>));
    },
    [params, setSearchParams],
  );

  const setParam = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const update = { [key]: value } as unknown as Partial<T>;
      setParams(update);
    },
    [setParams],
  );

  const resetParams = useCallback(() => {
    const defaults = schema.parse({}) as T;
    setSearchParams(serializeSearchParams(defaults as Record<string, unknown>));
  }, [schema, setSearchParams]);

  const value: SearchContextType<T> = {
    params,
    setParam,
    setParams,
    resetParams,
  };

  return <context.Context value={value}>{children}</context.Context>;
};

export default SearchProvider;
