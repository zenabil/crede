'use client';

import { useState, useEffect } from 'react';

// A simple hook to fetch a collection of data.
// The fetcher function should be memoized with useCallback in the component
// to prevent re-fetching on every render.
export function useCollectionOnce<T>(
  fetcher: (() => Promise<T[] | null>) | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (fetcher === null) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetcher()
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error('Failed to fetch collection:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetcher]); // The hook re-runs only if the fetcher function reference changes.

  return { data, loading, error };
}
