'use client';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { initializeFirebase } from '../index';

const { auth } = initializeFirebase();
const googleProvider = new GoogleAuthProvider();
// Request permission to manage app-private files on Google Drive.
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

export const signInWithGoogle = async () => {
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
