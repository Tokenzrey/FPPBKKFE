import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import api from '@/lib/api';
import { ApiError, ApiResponse } from '@/types/api';
import { Blog } from '@/types/entities/blog';
import { showToast } from '@/components/Toast';

/**
 * Upload blog data to the API
 * @param blogData Blog data including form fields and file
 * @returns Created blog data
 */
const createBlog = async (blogData: FormData): Promise<Blog> => {
  const response: AxiosResponse<ApiResponse<Blog>> = await api.post(
    '/api/blogs/',
    blogData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (response.data.status === 'success' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create blog');
};

/**
 * Custom hook for creating a blog
 */
export const useCreateBlog = () => {
  return useMutation<Blog, AxiosError<ApiError>, FormData>({
    mutationFn: createBlog,
    onSuccess: (data) => {
      // Show success toast
      showToast(
        'Blog Created Successfully',
        `Your blog "${data.judul}" has been posted.`,
        'SUCCESS',
      );
    },
    onError: (error) => {
      // Show error toast
      showToast(
        'Blog Creation Failed',
        error?.response?.data?.message || 'Failed to create the blog.',
        'ERROR',
      );
    },
  });
};
