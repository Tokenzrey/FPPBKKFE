import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

import { showToast } from '@/components/Toast';
import api from '@/lib/api';
import { setToken } from '@/lib/cookies';
import useAuthStore from '@/lib/Auth/useAuthStore';
import { ApiError, ApiResponse } from '@/types/api';
import { LoginFormRequest, LoginFormResponse } from '@/types/login';
import { User } from '@/types/entities/user';

export const useLoginMutation = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const searchParams = useSearchParams();
  const { mutateAsync: handleLogin, isPending } = useMutation<
    ApiResponse<LoginFormResponse>,
    AxiosError<ApiError>,
    LoginFormRequest
  >({
    mutationFn: async (data: LoginFormRequest) => {
      // Kirim data ke API
      const response: AxiosResponse<ApiResponse<LoginFormResponse>> =
        await api.post('/api/login', data);
      console.log(response);
      // Periksa status respons
      if (response.data.status == 'success' && response.data.data) {
        const { token } = response.data.data;
        console.log(token);
        // Set token di cookie
        setToken(token);

        // Ambil detail pengguna
        const userResponse: AxiosResponse<ApiResponse<User>> =
          await api.get('/api/users/');
        console.log(userResponse);
        if (userResponse.data.status !== 'success' || !userResponse.data.data) {
          throw new Error('Failed to retrieve user details.');
        }

        const userData: User = userResponse.data.data;

        // Pastikan email tersedia
        if (!userData.email) {
          throw new Error('email is missing in the response.');
        }

        // Login pengguna
        login({
          ...userData,
          token,
        });

        // Tampilkan notifikasi sukses
        showToast(
          'Login Successful',
          response.data.message || 'Success',
          'SUCCESS',
        );
        return response.data;
      }

      throw new Error(
        response.data.message || 'Login failed. Please try again.',
      );
    },
    onSuccess: () => {
      // Redirect setelah login sukses
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    },
    onError: (error) => {
      // Tampilkan pesan error
      const errorMessage =
        error.response?.data.message ||
        'Login failed. Please check your credentials and try again.';
      showToast('Login Failed', errorMessage, 'ERROR');
    },
  });

  return { handleLogin, isPending };
};
