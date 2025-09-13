"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { joinURL } from "@/utils/helpers";

type ApiInit = Omit<RequestInit, "signal">;

type UseApiOptions<T, S = T> = {
  /** Fire on mount/dep change. Default: true */
  immediate?: boolean;
  /** Extra deps that should trigger a re-fetch */
  deps?: ReadonlyArray<unknown>;
  /** Optional result projector */
  select?: (data: T) => S;
  /** Optional base URL (defaults to NEXT_PUBLIC_API_BASE_URL) */
  baseURL?: string;
};

export function useFetchWrapper<T = unknown, S = T>(
  path: string,
  init?: ApiInit,
  options: UseApiOptions<T, S> = {}
) {
  const {
    immediate = true,
    deps = [],
    select,
    baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  } = options;

  const [data, setData] = useState<S | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const ctrlRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    ctrlRef.current?.abort();
  }, []);

  const refetch = useCallback(
    async (override?: ApiInit): Promise<T | undefined> => {
      // Cancel any in-flight request
      ctrlRef.current?.abort();

      const controller = new AbortController();
      ctrlRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(joinURL(baseURL, path), {
          ...init,
          ...override,
          // Don't force content-type; only set it when sending a body.
          headers: {
            ...(init?.headers || {}),
            ...(override?.headers || {}),
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          const bodyText = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${bodyText || res.statusText}`);
        }

        const json = (await res.json()) as T;
        const projected = select ? (select(json) as S) : (json as unknown as S);
        setData(projected);
        return json;
      } catch (e: unknown) {
        const error = e instanceof Error ? e : new Error(String(e));
        if (error.name === "AbortError") {
          // Swallow aborts; caller can check loading/data/error
          return undefined;
        }
        setError(error);
        throw error;
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [baseURL, path, init, select]
  );

  useEffect(() => {
    if (!immediate) {
      return;
    }
    refetch().catch(() => {});
    return () => ctrlRef.current?.abort();
    // Re-run when path or external deps change.
    // Keep `init` stable from the call site or include it in `deps` if it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, immediate, refetch, ...deps]);

  return { data, error, loading, refetch, abort };
}
