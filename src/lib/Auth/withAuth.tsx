import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import LoadingPage from '@/components/Loading';
import { showToast } from '@/components/Toast';
import api from '@/lib/api';
import { AxiosError, AxiosResponse } from 'axios';
import { getToken, removeToken } from '@/lib/cookies';
import useAuthStore from './useAuthStore';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/entities/user';

export const USER_ROUTE = '/';
const LOGIN_ROUTE = '/login';

/**
 * Higher-order component (HOC) to handle authentication and public route access.
 * @param Component - The component to wrap.
 * @param routeType - 'auth' for protected routes or 'public' for publicly accessible routes.
 */
export default function withAuth<T>(
  Component: React.ComponentType<T>,
  routeType: 'auth' | 'public',
) {
  function ComponentWithAuth(props: T) {
    const [isMounted, setIsMounted] = useState(false); // To track client-side rendering
    const router = useRouter();
    const pathname = usePathname();
    const redirect = useSearchParams().get('redirect') || pathname;

    // Zustand selectors
    const isAuthenticated = useAuthStore.useIsAuthenticated();
    const isLoading = useAuthStore.useIsLoading();
    const login = useAuthStore.useLogin();
    const logout = useAuthStore.useLogout();
    const stopLoading = useAuthStore.useStopLoading();
    const user = useAuthStore.useUser();

    /**
     * Check authentication status and load user data if token is available.
     */
    const checkAuth = React.useCallback(() => {
      const token = getToken() || '';
      if (!token && isAuthenticated) {
        logout();
        stopLoading();
        return;
      }

      const loadUser = async () => {
        try {
          const res: AxiosResponse<ApiResponse<User>> =
            await api.get('/api/users/');

          // Handle backend response
          if (res.data.status !== 'success' || !res.data.data) {
            showToast('Invalid login session', 'Please login again', 'ERROR');
            throw new Error(res.data.message || 'Failed to retrieve user');
          }

          const userData = res.data.data; // Extract user data
          if (userData) {
            login({ ...userData, token }); // Pass token along with user data
          }
        } catch (err) {
          console.error('Error loading user:', err);
          removeToken();
          logout();
        } finally {
          stopLoading();
        }
      };

      if (token) {
        loadUser();
      } else {
        stopLoading();
      }
    }, [isAuthenticated, login, logout, stopLoading]);

    React.useEffect(() => {
      checkAuth();
      window.addEventListener('focus', checkAuth);
      return () => window.removeEventListener('focus', checkAuth);
    }, [checkAuth]);

    /**
     * Set isMounted to true after component mounts
     */
    useEffect(() => {
      setIsMounted(true); // Mark as mounted after the first render
    }, []);

    /**
     * Handle redirection based on authentication status and route type.
     */
    React.useEffect(() => {
      if (!isLoading) {
        if (routeType === 'auth' && !isAuthenticated) {
          // Redirect to login page if the route is protected and the user is not authenticated
          showToast('Please login to continue', 'Access denied', 'ERROR');
          router.push(`${LOGIN_ROUTE}?redirect=${pathname}`);
        } else if (routeType === 'public' && isAuthenticated) {
          // Redirect to the default user route or the provided redirect path if authenticated
          router.replace(redirect);
        }
      }
    }, [isAuthenticated, isLoading, redirect, router, routeType]);

    /**
     * Render the loading page or the component after mounting
     */
    if (!isMounted || isLoading) {
      return <LoadingPage />;
    }

    // Render the wrapped component
    return <Component {...(props as T)} user={user} />;
  }

  return ComponentWithAuth;
}
