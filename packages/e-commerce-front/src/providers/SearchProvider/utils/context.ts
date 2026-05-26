import type { SearchContextType } from "@/providers/SearchProvider/types";
import { createContext, useContext } from "react";

/**
 * Creates a typed search context and a corresponding hook for consuming it.
 *
 * @template T - The type of the search state managed by this context.
 * @returns An object containing the React context (`Context`) and a hook (`useSearch`)
 *          that throws if used outside of its provider.
 *
 * @example
 * const { Context, useSearch } = createSearchContext<MyFilters>();
 */
export function createSearchContext<T>() {
  const Context = createContext<SearchContextType<T> | null>(null);

  function useSearch() {
    const context = useContext(Context);

    if (!context) {
      throw new Error("useSearch must be used within SearchProvider");
    }

    return context;
  }

  return {
    Context,
    useSearch,
  };
}
