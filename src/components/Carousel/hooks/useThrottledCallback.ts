import { useRef, useEffect, useCallback } from "react";

function useThrottledCallback<Args extends unknown[]>(
  callback: (...params: Args) => void,
  time: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // callback이 변경될 때마다 callbackRef를 업데이트
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const throttledCallback = useCallback(
    (...params: Args) => {
      if (!timer.current) {
        callbackRef.current(...params);
        timer.current = setTimeout(() => {
          timer.current = null;
        }, time);
      }
    },
    [time]
  );

  return throttledCallback;
}

export default useThrottledCallback;
