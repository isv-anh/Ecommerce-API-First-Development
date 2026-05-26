export type SearchContextType<T> = {
  params: T;
  setParam: <K extends keyof T>(key: K, value: T[K]) => void;
  setParams: (updates: Partial<T>) => void;
  resetParams: () => void;
};
