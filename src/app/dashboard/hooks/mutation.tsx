import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import api from '@/lib/api';
import { ApiError, ApiResponse } from '@/types/api';
import { Blog } from '@/types/entities/blog';

/**
 * Fetch blogs from the API
 * @param page Current page number
 * @param perPage Number of items per page
 * @param sort Sorting criteria ('likes' or 'comments')
 * @returns Array of blogs
 */
const fetchBlogs = async (
  page = 1,
  perPage = 15,
  sort?: string,
): Promise<{ blogs: Blog[]; currentPage: number; totalPages: number }> => {
  const response: AxiosResponse<
    ApiResponse<{
      data: Blog[];
      current_page: number;
      last_page: number;
    }>
  > = await api.get('/api/blogs', {
    params: { page, perPage, sort },
  });

  if (response.data.status === 'success' && response.data.data) {
    const {
      data: blogs,
      current_page: currentPage,
      last_page: totalPages,
    } = response.data.data;

    return { blogs, currentPage, totalPages };
  }

  throw new Error(response.data.message || 'Failed to fetch blogs');
};

/**
 * Custom hook to fetch paginated blogs with placeholderData for smooth pagination
 * @param page Current page number
 * @param perPage Number of items per page
 * @param sort Sorting criteria ('likes' or 'comments')
 */
export const useBlogs = (page: number, perPage: number, sort?: string) => {
  return useQuery<
    {
      blogs: Blog[];
      currentPage: number;
      totalPages: number;
    },
    AxiosError<ApiError>
  >({
    queryKey: ['blogs', page, perPage, sort],
    queryFn: () => fetchBlogs(page, perPage, sort),
    placeholderData: {
      blogs: [], // Placeholder data
      currentPage: page,
      totalPages: 1,
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};

/**
 * Fetch blogs from the API with optional search and pagination parameters
 * @param page Current page number
 * @param perPage Number of items per page
 * @param search Search keyword
 * @param filter Filter criteria ('username', 'judul', 'content', 'all')
 */
const fetchSearchBlogs = async (
  page: number,
  perPage: number,
  search = '',
  filter = 'all',
): Promise<ApiResponse<{ data: Blog[]; total: number }>> => {
  const response: AxiosResponse<ApiResponse<{ data: Blog[]; total: number }>> =
    await api.get('/api/blogs/search', {
      params: { page, perPage, search, filter },
    });

  if (response.data.status === 'success') {
    return response.data;
  }

  throw new Error(response.data.message || 'Failed to fetch blogs');
};

/**
 * Custom hook to fetch paginated blogs with optional search and filter parameters.
 * @param page Current page number
 * @param perPage Number of items per page
 * @param search Search keyword
 * @param filter Filter criteria ('username', 'judul', 'content', 'all')
 */
export const useSearchBlogs = (
  page: number,
  perPage: number,
  search = '',
  filter = 'all',
) => {
  return useQuery<
    ApiResponse<{ data: Blog[]; total: number }>,
    AxiosError<ApiError>
  >({
    queryKey: ['blogs', page, perPage, search, filter],
    queryFn: () => fetchSearchBlogs(page, perPage, search, filter),
    placeholderData: {
      status: 'success',
      data: {
        data: [],
        total: 0,
      },
      message: '',
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};
