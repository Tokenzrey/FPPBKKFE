import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import api from '@/lib/api';
import { ApiError, ApiResponse } from '@/types/api';
import { User } from '@/types/entities/user';
import { showToast } from '@/components/Toast';

/**
 * Fetch user profile from the API
 * @returns User profile data
 */
const fetchUserProfile = async (): Promise<User> => {
  const response: AxiosResponse<ApiResponse<User>> =
    await api.get('/api/users/');

  if (response.data.status === 'success' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch user profile');
};

/**
 * Custom hook to fetch user profile
 */
export const useUserProfile = () => {
  return useQuery<User, AxiosError<ApiError>>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    placeholderData: {
      id: 0,
      name: '',
      email: '',
      tanggal_lahir: '',
      biografi: '',
    }, // Placeholder data for smoother transitions
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};

/**
 * Update user profile in the API
 * @param userData User data to update
 * @returns Updated user profile data
 */
const updateUserProfile = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response: AxiosResponse<ApiResponse<User>> = await api.put(
    '/api/users/update',
    userData,
  );

  if (response.data.status === 'success' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update user profile');
};

/**
 * Custom hook to update user profile
 */
export const useUpdateUser = () => {
  return useMutation<User, AxiosError<ApiError>, Omit<User, 'id'>>({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Show success toast
      showToast(
        'Profile Updated Successfully',
        `Your profile has been updated: ${data.name}`,
        'SUCCESS',
      );
    },
    onError: (error) => {
      // Show error toast
      showToast(
        'Profile Update Failed',
        error?.response?.data?.message ||
          'An error occurred while updating your profile.',
        'ERROR',
      );
    },
  });
};
