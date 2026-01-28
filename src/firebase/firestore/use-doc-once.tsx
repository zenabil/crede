'use client';

import { useState, useEffect } from 'react';
import { getDoc, type DocumentReference, type DocumentData } from 'firebase/firestore';

export function useDocOnce<T>(docRef: DocumentReference<DocumentData> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [docRef]);

  return { data, loading, error };
}
