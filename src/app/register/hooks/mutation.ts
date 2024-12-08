import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';

import { showToast } from '@/components/Toast';
import api from '@/lib/api';
import { ApiResponse, ApiError } from '@/types/api';
import { RegisterFormRequest, RegisterFormResponse } from '@/types/login';

export const useRegisterMutation = () => {
  const router = useRouter();

  const { mutateAsync: handleRegister, isPending } = useMutation<
    ApiResponse<RegisterFormResponse>,
    AxiosError<ApiError>,
    RegisterFormRequest
  >({
    mutationFn: async (data: RegisterFormRequest) => {
      const response: AxiosResponse<ApiResponse<RegisterFormResponse>> =
        await api.post('/api/signup', data);

      if (response.data.status === 'success') {
        showToast('Registration Successful', 'You can now log in!', 'SUCCESS');
        return response.data;
      }

      // Jika status error, lempar pesan error
      throw new Error(response.data.message || 'An error occurred.');
    },
    onSuccess: () => {
      // Redirect ke halaman login
      router.push('/login');
    },
    onError: (error) => {
      const errorMessage =
        error.message || 'An error occurred during registration.';
      showToast('Registration Failed', errorMessage, 'ERROR');
    },
  });

  return { handleRegister, isPending };
};
