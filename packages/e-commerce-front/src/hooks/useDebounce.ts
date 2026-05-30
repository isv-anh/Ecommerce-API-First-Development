import { useEffect, useState } from "react";

const defaultDelay = 500;

const useDebounce = <T>(value: T, delay = defaultDelay): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
