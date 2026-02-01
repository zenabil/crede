'use client';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  getAuth,
  initializeApp,
  getApps,
  type FirebaseApp
} from 'firebase/auth';
import { useState, useEffect } from 'react';

// NOTE: This file is for placeholder configuration only.
// It will be replaced with your actual Firebase project configuration.
export const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:XXXXXXXXXXXXXXXXXXXXXX",
};


// Note: These are lazy-loaded and initialized once.
let app: FirebaseApp | undefined;
let auth: any = undefined;

export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!app) {
      if (getApps().length > 0) {
        app = getApps()[0];
      } else {
        app = initializeApp(firebaseConfig);
      }
      auth = getAuth(app);
    }
  }
  return { app, auth };
}


const googleProvider = new GoogleAuthProvider();
// Request permission to manage app-private files on Google Drive.
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

export const signInWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // The access token is needed to access Google APIs like Drive.
    const token = credential?.accessToken;

    if (token) {
      // Use sessionStorage to keep the token available for the current tab session.
      sessionStorage.setItem('google_access_token', token);
    }
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    if (error instanceof Error) {
      // Provide more specific feedback for common errors
      if ((error as any).code === 'auth/popup-closed-by-user') {
        throw new Error('La fenêtre de connexion a été fermée.');
      }
      if ((error as any).code === 'auth/cancelled-popup-request') {
        throw new Error('Une seule fenêtre de connexion peut être ouverte à la fois.');
      }
    }
    throw new Error('Une erreur est survenue lors de la connexion.');
  }
};

export const getGoogleAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('google_access_token');
};

export const signOut = async () => {
  if (!auth) return;
  try {
    // Clear the token on sign out
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('google_access_token');
    }
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};


interface UseUserReturn {
  user: User | null;
  loading: boolean;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(() => auth?.currentUser || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
