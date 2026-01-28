'use client';
import React, { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

type FirebaseContextValue = {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
};

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  firestore: null,
});

export function FirebaseProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: FirebaseContextValue;
}) {
  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext)?.firebaseApp;
export const useFirestore = () => useContext(FirebaseContext)?.firestore;
