import { useCallback, useEffect, useRef } from 'react';

export default function useDebounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
) {
  const fnRef = useRef(fn);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
