import { DEMO_PERSONAS } from '@/data/taxonomy';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { SavedScheme, UnmatchedOccupation, UserProfile } from '@/types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  increment
} from 'firebase/firestore';

const STORAGE_KEYS = {
  CURRENT_USER: 'scheme_navigator_user_profile',
  SAVED_SCHEMES: 'scheme_navigator_saved_schemes',
  UNMATCHED_OCCUPATIONS: 'scheme_navigator_unmatched_occupations'
};

/**
 * Get the currently active user profile
 * Defaults to the Ramesh Kumar (Farmer) demo persona if none exists
 */
export function getActiveProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return DEMO_PERSONAS[0].profile;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read profile from localStorage:', e);
  }

  // Default to first demo persona (Ramesh Kumar)
  const defaultProfile = DEMO_PERSONAS[0].profile;
  setActiveProfile(defaultProfile);
  return defaultProfile;
}

/**
 * Update the currently active user profile
 */
export async function setActiveProfile(profile: UserProfile): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('scheme_navigator_profile_updated', { detail: profile }));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  }

  // If Firebase Firestore is active and user is logged in
  if (isFirebaseConfigured && db && profile.id) {
    try {
      const profileRef = doc(db, 'profiles', profile.id);
      await setDoc(profileRef, profile, { merge: true });
    } catch (e) {
      console.warn('Firestore profile sync failed, relying on local storage:', e);
    }
  }
}

/**
 * Switch to a specific demo persona (for instant judge demo testing)
 */
export function switchDemoPersona(personaId: string): UserProfile {
  const found = DEMO_PERSONAS.find((p) => p.id === personaId);
  const profile = found ? found.profile : DEMO_PERSONAS[0].profile;
  setActiveProfile(profile);
  return profile;
}

/**
 * Get list of saved scheme IDs
 */
export function getSavedSchemeIds(): string[] {
  if (typeof window === 'undefined') return ['pm-kisan', 'ab-pmjay'];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_SCHEMES);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error('Failed to read saved schemes from localStorage:', e);
  }

  // Default sample bookmark for initial visual polish
  const initial = ['pm-kisan', 'ab-pmjay'];
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_SCHEMES, JSON.stringify(initial));
  } catch {}
  return initial;
}

/**
 * Toggle saving/bookmarking a scheme
 */
export async function toggleSaveScheme(schemeId: string): Promise<boolean> {
  const current = getSavedSchemeIds();
  const exists = current.includes(schemeId);
  let updated: string[];

  if (exists) {
    updated = current.filter((id) => id !== schemeId);
  } else {
    updated = [...current, schemeId];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_SCHEMES, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('scheme_navigator_saved_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to save schemes to localStorage:', e);
    }
  }

  // Sync to Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const activeUser = getActiveProfile();
      const savedDocRef = doc(db, 'saved_schemes', `${activeUser.id}_${schemeId}`);
      if (exists) {
        await deleteDoc(savedDocRef);
      } else {
        await setDoc(savedDocRef, {
          user_id: activeUser.id,
          scheme_id: schemeId,
          saved_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Firestore saved scheme sync failed:', e);
    }
  }

  return !exists;
}

/**
 * Log unmatched free-text occupation query
 */
export async function logUnmatchedOccupation(rawText: string): Promise<void> {
  if (!rawText || rawText.trim().length === 0) return;
  const clean = rawText.trim().toLowerCase();

  // Local storage backlog
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.UNMATCHED_OCCUPATIONS);
      const items: UnmatchedOccupation[] = raw ? JSON.parse(raw) : [];
      const existing = items.find((i) => i.occupation_raw.toLowerCase() === clean);

      if (existing) {
        existing.count += 1;
        existing.last_seen = new Date().toISOString();
      } else {
        items.push({
          occupation_raw: clean,
          count: 1,
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString()
        });
      }

      localStorage.setItem(STORAGE_KEYS.UNMATCHED_OCCUPATIONS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to log unmatched occupation locally:', e);
    }
  }

  // Firestore sync if configured
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'unmatched_occupations', clean.replace(/[^a-z0-9]/g, '_'));
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        await updateDoc(docRef, {
          count: increment(1),
          last_seen: new Date().toISOString()
        });
      } else {
        await setDoc(docRef, {
          occupation_raw: clean,
          count: 1,
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Firestore unmatched occupation logging failed:', e);
    }
  }
}

/**
 * Get all logged unmatched occupations
 */
export function getUnmatchedOccupations(): UnmatchedOccupation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNMATCHED_OCCUPATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
