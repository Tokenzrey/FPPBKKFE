import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { removeToken, setToken } from '@/lib/cookies';
import { User, loginToken } from '@/types/entities/user';

/**
 * AuthStoreType defines the structure of the authentication store.
 * This includes user information, authentication state, and utility functions for login/logout.
 *
 * @typedef {Object} AuthStoreType
 * @property {User | null} user - The currently authenticated user, or null if not authenticated.
 * @property {boolean} isAuthenticated - Indicates whether the user is authenticated.
 * @property {boolean} isLoading - Indicates whether the authentication state is currently loading.
 * @property {(user: User & loginToken) => void} login - Function to log in the user.
 * @property {() => void} logout - Function to log out the user.
 * @property {() => void} stopLoading - Function to stop the loading state.
 */
type AuthStoreType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User & loginToken) => void;
  logout: () => void;
  stopLoading: () => void;
};

/**
 * Creates the base authentication store using Zustand.
 * The store is persisted in localStorage, with state updates handled immutably via Immer.
 */
const useAuthStoreBase = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null, // Initial user state (no user logged in).
      isAuthenticated: false, // Default authentication state.
      isLoading: true, // Default loading state.

      /**
       * Logs in the user.
       * Updates the store with user data, sets the authentication state, and saves the token in cookies.
       *
       * @param {User & loginToken} user - The user object containing token and user details.
       */
      login: (user: User & loginToken) => {
        try {
          // Save token to cookies
          setToken(user.token);

          // Update store state immutably using Immer
          set(
            produce((state: AuthStoreType) => {
              state.user = user; // Store user data
              state.isAuthenticated = true; // Mark user as authenticated
              state.isLoading = false; // Stop the loading state
            }),
          );
        } catch (error) {
          console.error('Error during login process:', error); // Log any errors
        }
      },

      /**
       * Logs out the user.
       * Clears user data from the store, removes the authentication token, and resets the state.
       */
      logout: () => {
        try {
          // Remove token from cookies
          removeToken();

          // Reset store state immutably using Immer
          set(
            produce((state: AuthStoreType) => {
              state.user = null; // Clear user data
              state.isAuthenticated = false; // Reset authentication state
            }),
          );
        } catch (error) {
          console.error('Error during logout process:', error); // Log any errors
        }
      },

      /**
       * Stops the loading state.
       * Typically used after the initial authentication check completes.
       */
      stopLoading: () => {
        set(
          produce((state: AuthStoreType) => {
            state.isLoading = false; // Mark loading as complete
          }),
        );
      },
    }),
    {
      name: '@pbkk/token', // Key for localStorage persistence
      getStorage: () => localStorage, // Use localStorage for persistence
    },
  ),
);

/**
 * Creates selector hooks for the authentication store.
 * This allows components to access specific state properties without rerendering unnecessarily.
 */
const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
