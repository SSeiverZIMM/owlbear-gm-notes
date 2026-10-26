// Firebase's web config is meant to live in client-side code — it's not a secret. The real access
// boundary is Firestore's own Security Rules (see docs/store.md or the setup notes), not hiding
// these values. Paste the `firebaseConfig` object shown in Firebase Console →
// Project Settings → General → Your apps → (web app) here, replacing the placeholders below.
export const firebaseConfig = {
  apiKey: "AIzaSyC0WS-Ajv2FmYbs0pm3iWjOemHV7CPwmg4",
  authDomain: "gmnotescn-455ba.firebaseapp.com",
  projectId: "gmnotescn-455ba",
  storageBucket: "gmnotescn-455ba.firebasestorage.app",
  messagingSenderId: "1045135869892",
  appId: "1:1045135869892:web:cead9b71d66aec179a4691",
};

// Cloud sync is entirely optional and only activates once this looks like a real config — this lets
// the app run normally (local-only) for anyone who hasn't set up a Firebase project, instead of
// crashing on a bogus "REPLACE_ME" API key.
export function hasFirebaseConfig(): boolean {
  return firebaseConfig.apiKey !== "REPLACE_ME" && !!firebaseConfig.apiKey;
}
