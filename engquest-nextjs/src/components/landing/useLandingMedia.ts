"use client";

import { useCallback, useSyncExternalStore } from "react";

export const LANDING_DESKTOP_QUERY = "(min-width: 1024px)";
export const LANDING_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useLandingMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onStoreChange);

      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
