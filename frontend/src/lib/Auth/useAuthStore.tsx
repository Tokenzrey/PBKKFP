import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { removeToken, setToken } from '@/lib/cookies';
import { User, loginToken } from '@/types/entities/user';

/**
 * AuthStoreType defines the structure and functionality of the authentication store.
 * @typedef {Object} AuthStoreType
 * @property {User | null} user - The currently authenticated user, or null if not authenticated.
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {boolean} isLoading - Indicates if authentication state is currently loading.
 * @property {(user: User & withToken) => void} login - Function to log in the user.
 * @property {() => void} logout - Function to log out the user.
 * @property {() => void} stopLoading - Function to stop loading state.
 */
// AuthStoreType defines the structure and functionality of the auth store.
type AuthStoreType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User & loginToken) => void;
  logout: () => void;
  stopLoading: () => void;
};

// Base auth store with Zustand, using immer for immutability and zustand-persist for persistence.
const useAuthStoreBase = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null, // Initial user state is null
      isAuthenticated: false, // User is not authenticated by default
      isLoading: true, // Set loading state to true initially

      /**
       * Login updates the state with user data and sets the token in cookies.
       * @param {User & withToken} user - The user object containing token and user data.
       */
      login: (user: User & loginToken) => {
        try {
          setToken(user.token); // Set token in cookies
          set(
            produce((state: AuthStoreType) => {
              state.user = user; // Update user state
              state.isAuthenticated = true; // Set authenticated status
              state.isLoading = false; // Stop loading after login
            }),
          );
        } catch (error) {
          console.error('Error setting token:', error); // Log any errors
        }
      },

      /**
       * Logout clears the user data and removes the token from cookies.
       */
      logout: () => {
        try {
          removeToken(); // Remove token from cookies
          set(
            produce((state: AuthStoreType) => {
              state.user = null; // Clear user state
              state.isAuthenticated = false; // Set authenticated status to false
            }),
          );
        } catch (error) {
          console.error('Error removing token:', error); // Log any errors
        }
      },

      /**
       * stopLoading sets the loading state to false.
       */
      stopLoading: () => {
        set(
          produce((state: AuthStoreType) => {
            state.isLoading = false; // Stop loading
          }),
        );
      },
    }),
    { name: '@comick/token', getStorage: () => localStorage }, // Persisting in localStorage with custom key
  ),
);

// Use createSelectorHooks for easy selector usage within components.
const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
