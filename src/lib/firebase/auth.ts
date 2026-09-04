import { isFirebaseConfigured, db, auth } from '@/lib/firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { UserProfile, OccupationType, GenderType, CategoryType } from '@/types';
import { setActiveProfile, getActiveProfile } from '@/lib/firebase/storage';
import { DEMO_PERSONAS } from '@/data/taxonomy';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs
} from 'firebase/firestore';

export interface UserAccount {
  id: string;
  identifier: string; // email or mobile or username
  passwordHash: string; // stored credentials
  name: string;
  occupation: OccupationType;
  created_at: string;
  profile_id: string;
}

const STORAGE_KEYS = {
  REGISTERED_USERS: 'scheme_navigator_registered_users',
  ACTIVE_SESSION: 'scheme_navigator_active_session'
};

// Seed default accounts matching demo personas for immediate testing if needed
const SEED_USERS: UserAccount[] = [
  {
    id: 'user_ramesh',
    identifier: 'ramesh@gov.in',
    passwordHash: 'farmer123',
    name: 'Ramesh Kumar',
    occupation: 'farmer',
    created_at: '2026-01-01T00:00:00.000Z',
    profile_id: 'ramesh-kumar'
  },
  {
    id: 'user_priya',
    identifier: 'priya@gov.in',
    passwordHash: 'student123',
    name: 'Priya Sharma',
    occupation: 'student',
    created_at: '2026-01-01T00:00:00.000Z',
    profile_id: 'priya-sharma'
  },
  {
    id: 'user_sunita',
    identifier: 'sunita@gov.in',
    passwordHash: 'vendor123',
    name: 'Sunita Devi',
    occupation: 'street_vendor',
    created_at: '2026-01-01T00:00:00.000Z',
    profile_id: 'sunita-devi'
  }
];

let inMemoryUsers: UserAccount[] = [...SEED_USERS];

/**
 * Get all registered users from localStorage registry (with seed users)
 */
export function getRegisteredUsersLocally(): UserAccount[] {
  if (typeof window === 'undefined') {
    return inMemoryUsers;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_USERS;
  } catch (e) {
    console.error('Failed to read registered users:', e);
    return SEED_USERS;
  }
}

/**
 * Save user to localStorage registry and in-memory cache
 */
function saveUserLocally(user: UserAccount): void {
  inMemoryUsers = inMemoryUsers.filter(
    (u) => u.identifier.toLowerCase() !== user.identifier.toLowerCase()
  );
  inMemoryUsers.push(user);

  if (typeof window === 'undefined') return;
  try {
    const users = getRegisteredUsersLocally();
    const filtered = users.filter(
      (u) => u.identifier.toLowerCase() !== user.identifier.toLowerCase()
    );
    filtered.push(user);
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save user locally:', e);
  }
}

export interface RegisterPayload {
  identifier: string; // email or mobile
  password: string;
  name: string;
  age: number;
  gender: GenderType;
  state: string;
  occupation: OccupationType;
  annual_income: number;
  category: CategoryType;
  land_holding_acres?: number;
  occupation_specific_data?: Record<string, any>;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: UserAccount;
  profile?: UserProfile;
}

/**
 * Register a new citizen account
 * Stores in Firebase Firestore (users + profiles collections) and local registry
 */
export async function registerCitizen(payload: RegisterPayload): Promise<AuthResult> {
  const cleanId = payload.identifier.trim().toLowerCase();
  if (!cleanId || !payload.password) {
    return { success: false, error: 'Email/Mobile and password are required.' };
  }
  if (!payload.name.trim()) {
    return { success: false, error: 'Full name is required.' };
  }

  // 1. Check if user already exists in Firebase Firestore (or locally)
  if (isFirebaseConfigured && db) {
    try {
      const userDocRef = doc(db, 'users', cleanId.replace(/[^a-z0-9]/g, '_'));
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        return {
          success: false,
          error: 'An account with this email/mobile already exists. Please log in.'
        };
      }
    } catch (e) {
      console.warn('Firebase user check fallback:', e);
    }
  }

  // Check local registry
  const localUsers = getRegisteredUsersLocally();
  const existingLocal = localUsers.find((u) => u.identifier.toLowerCase() === cleanId);
  if (existingLocal) {
    return {
      success: false,
      error: 'An account with this email/mobile already exists. Please log in.'
    };
  }

  const userId = `usr_${Date.now()}`;
  const profileId = `prof_${Date.now()}`;

  // Build the complete citizen UserProfile
  const profile: UserProfile = {
    id: profileId,
    name: payload.name.trim(),
    age: payload.age || 35,
    gender: payload.gender || 'male',
    state: payload.state || 'Uttar Pradesh',
    occupation: payload.occupation || 'farmer',
    annual_income: Number(payload.annual_income) || 120000,
    category: payload.category || 'general',
    special_conditions: payload.land_holding_acres ? ['has_land'] : [],
    land_holding_acres: payload.land_holding_acres || 0,
    occupation_specific_data: payload.occupation_specific_data || {},
    updated_at: new Date().toISOString()
  };

  const account: UserAccount = {
    id: userId,
    identifier: cleanId,
    passwordHash: payload.password, // Stored credentials
    name: payload.name.trim(),
    occupation: payload.occupation,
    created_at: new Date().toISOString(),
    profile_id: profileId
  };

  // 2. Write to Firebase Firestore collections 'users' and 'profiles'
  if (isFirebaseConfigured && db) {
    try {
      const docKey = cleanId.replace(/[^a-z0-9]/g, '_');
      await setDoc(doc(db, 'users', docKey), account);
      await setDoc(doc(db, 'profiles', profileId), profile);
      console.log('Successfully registered user in Firebase Firestore:', cleanId);
    } catch (e) {
      console.warn('Firebase Firestore registration write error, fallback to local storage:', e);
    }
  }

  // 3. Save to local storage registry and activate session
  saveUserLocally(account);
  await setActiveProfile(profile);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(account));
      window.dispatchEvent(new CustomEvent('scheme_navigator_auth_change', { detail: account }));
    } catch (e) {}
  }

  return {
    success: true,
    message: 'Account successfully registered and saved to database!',
    user: account,
    profile
  };
}

/**
 * Login an existing citizen account
 * If entry is not found in database or password doesn't match:
 * returns explicit error "Invalid credentials or user not registered. Please register first."
 */
export async function loginCitizen(identifier: string, password: string): Promise<AuthResult> {
  const cleanId = identifier.trim().toLowerCase();
  if (!cleanId || !password) {
    return {
      success: false,
      error: 'Please enter both your email/mobile and password.'
    };
  }

  let foundUser: UserAccount | null = null;
  let userProfile: UserProfile | null = null;

  // 1. Try fetching from Firebase Firestore first
  if (isFirebaseConfigured && db) {
    try {
      const docKey = cleanId.replace(/[^a-z0-9]/g, '_');
      const userDocRef = doc(db, 'users', docKey);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        foundUser = snap.data() as UserAccount;
        // Fetch corresponding profile
        const profSnap = await getDoc(doc(db, 'profiles', foundUser.profile_id));
        if (profSnap.exists()) {
          userProfile = profSnap.data() as UserProfile;
        }
      }
    } catch (e) {
      console.warn('Firebase lookup failed, checking local registry:', e);
    }
  }

  // 2. Check local database if not found in Firestore
  if (!foundUser) {
    const localUsers = getRegisteredUsersLocally();
    const match = localUsers.find(
      (u) => u.identifier.toLowerCase() === cleanId
    );
    if (match) {
      foundUser = match;
      // If it's a seed persona, match with the DEMO_PERSONAS profile
      const demo = DEMO_PERSONAS.find((d) => d.profile.id === match.profile_id);
      userProfile = demo ? demo.profile : null;
    }
  }

  // 3. IF ENTRY NOT FOUND IN DATABASE:
  if (!foundUser) {
    return {
      success: false,
      error: 'Not registered or invalid credentials. Please register first to access your portal.'
    };
  }

  // 4. Validate Password:
  if (foundUser.passwordHash !== password) {
    return {
      success: false,
      error: 'Not registered or invalid credentials. Please check your password or register.'
    };
  }

  // 5. Build/Restore Profile if needed
  if (!userProfile) {
    userProfile = {
      id: foundUser.profile_id,
      name: foundUser.name,
      age: 40,
      gender: 'male',
      state: 'Uttar Pradesh',
      occupation: foundUser.occupation,
      annual_income: 140000,
      category: 'general',
      special_conditions: [],
      updated_at: new Date().toISOString()
    };
  }

  // 6. Set Active Session & Profile
  await setActiveProfile(userProfile);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(foundUser));
      window.dispatchEvent(new CustomEvent('scheme_navigator_auth_change', { detail: foundUser }));
    } catch (e) {}
  }

  return {
    success: true,
    message: `Welcome back, ${foundUser.name}!`,
    user: foundUser,
    profile: userProfile
  };
}

/**
 * Sign in / Register with Google OAuth popup in Firebase
 */
export async function loginWithGoogle(): Promise<AuthResult> {
  if (!auth) {
    return {
      success: false,
      error: 'Firebase Auth is initializing. Please check your network or try again.'
    };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const googleUser = result.user;
    const email = googleUser.email?.toLowerCase();

    if (!email) {
      return { success: false, error: 'Could not retrieve email from Google account.' };
    }

    const docKey = email.replace(/[^a-z0-9]/g, '_');
    let foundUser: UserAccount | null = null;
    let foundProfile: UserProfile | null = null;

    // 1. Check if user already registered in Firestore
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'users', docKey));
        if (snap.exists()) {
          foundUser = snap.data() as UserAccount;
          const profSnap = await getDoc(doc(db, 'profiles', foundUser.profile_id));
          if (profSnap.exists()) {
            foundProfile = profSnap.data() as UserProfile;
          }
        }
      } catch (e) {
        console.warn('Firestore Google check fallback:', e);
      }
    }

    // 2. If user is not yet in database, register them immediately in Firebase!
    if (!foundUser || !foundProfile) {
      const profileId = `prof_${Date.now()}`;
      foundUser = {
        id: googleUser.uid,
        identifier: email,
        passwordHash: 'GOOGLE_SSO_AUTHENTICATED',
        name: googleUser.displayName || 'Citizen',
        occupation: 'farmer',
        created_at: new Date().toISOString(),
        profile_id: profileId
      };

      foundProfile = {
        id: profileId,
        name: googleUser.displayName || 'Citizen',
        email: email,
        age: 36,
        gender: 'male',
        state: 'Uttar Pradesh',
        occupation: 'farmer',
        annual_income: 150000,
        category: 'general',
        special_conditions: ['has_land'],
        land_holding_acres: 2.5,
        updated_at: new Date().toISOString()
      };

      if (db) {
        try {
          await setDoc(doc(db, 'users', docKey), foundUser);
          await setDoc(doc(db, 'profiles', profileId), foundProfile);
          console.log('Registered new Google citizen in Firebase Firestore:', email);
        } catch (e) {
          console.warn('Failed to write Google user to Firestore:', e);
        }
      }
    }

    // 3. Save locally & activate session
    saveUserLocally(foundUser);
    await setActiveProfile(foundProfile);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(foundUser));
      window.dispatchEvent(new CustomEvent('scheme_navigator_auth_change', { detail: foundUser }));
    }

    return {
      success: true,
      message: `Signed in with Google as ${foundUser.name}!`,
      user: foundUser,
      profile: foundProfile
    };
  } catch (err: any) {
    console.error('Google Sign-In error:', err);
    if (err?.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Google sign-in popup was closed before completing.' };
    }
    return {
      success: false,
      error: err?.message || 'Google sign-in failed. Please try again or use email registration.'
    };
  }
}

/**
 * Logout current citizen
 */
export function logoutCitizen(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      window.dispatchEvent(new CustomEvent('scheme_navigator_auth_change', { detail: null }));
    } catch (e) {}
  }
}

/**
 * Get current authenticated user session
 */
export function getAuthenticatedUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
