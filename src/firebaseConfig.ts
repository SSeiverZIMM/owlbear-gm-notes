// Firebase's web config is meant to live in client-side code — it's not a secret. The real access
// boundary is Firestore's own Security Rules (see docs/store.md or the setup notes), not hiding
// these values. Paste the `firebaseConfig` object shown in Firebase Console →
// Project Settings → General → Your apps → (web app) here, replacing the placeholders below.
export const firebaseConfig = {
  apiKey: "AIzaSyBjz6BjMJUjF6gw3xv1ObWj15dBXpP_N7s",
  authDomain: "gmotescn.firebaseapp.com",
  projectId: "gmotescn",
  storageBucket: "gmotescn.firebasestorage.app",
  messagingSenderId: "197596023117",
  appId: "1:197596023117:web:12e9ebddd12350032d8f04",
};

// Cloud sync is entirely optional and only activates once this looks like a real config — this lets
// the app run normally (local-only) for anyone who hasn't set up a Firebase project, instead of
// crashing on a bogus "REPLACE_ME" API key.
export function hasFirebaseConfig(): boolean {
  return firebaseConfig.apiKey !== "REPLACE_ME" && !!firebaseConfig.apiKey;
}
