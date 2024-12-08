import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { GetServerSidePropsContext } from 'next';
import Cookies from 'universal-cookie';

import { getToken } from '@/lib/cookies';
import { ApiResponse } from '@/types/api';

let apiContext: GetServerSidePropsContext | null = null;

/**
 * Set API context untuk SSR (Server-Side Rendering).
 * Harus dipanggil sebelum melakukan request API di server.
 * @param {GetServerSidePropsContext} context - Context dari Next.js (getServerSideProps atau getStaticProps).
 */
export const setApiContext = (context: GetServerSidePropsContext): void => {
  apiContext = context;
};

/**
 * Mendapatkan base URL untuk request API berdasarkan environment (dev/prod).
 * @returns {string} Base URL API.
 * @throws {Error} Jika environment mode tidak diatur.
 */
function getBaseURL(): string {
  const mode = process.env.NEXT_PUBLIC_RUN_MODE;

  if (mode === 'development') {
    return process.env.NEXT_PUBLIC_API_URL_DEV || '';
  } else if (mode === 'production') {
    return process.env.NEXT_PUBLIC_API_URL_PROD || '';
  } else {
    throw new Error(
      'Environment mode tidak diatur. Periksa NEXT_PUBLIC_RUN_MODE.',
    );
  }
}

/**
 * Membuat instance Axios dengan konfigurasi default.
 */
export const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Credentials tidak dikirim secara default.
});

/**
 * Mengecek apakah kode sedang dijalankan di browser.
 * @returns {boolean} True jika dijalankan di browser, false jika di server.
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Interceptor Request:
 * Menambahkan Authorization header dengan Bearer token jika tersedia.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!config.headers) return config;

    let token: string | undefined = undefined;

    if (isBrowser) {
      // Client-side: Mengambil token dari cookies/local storage.
      token = getToken();
    } else {
      // Server-side: Mengambil token dari cookies berdasarkan API context.
      if (!apiContext) {
        throw new Error(
          'API context belum diatur. Panggil `setApiContext(context)` sebelum request server-side.',
        );
      }

      const cookies = new Cookies(apiContext.req?.headers.cookie);
      token = cookies.get('@comick/token');
    }

    // Menambahkan Authorization header jika token ada.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor Response:
 * Menangani response sukses dan mengkustomisasi pesan error.
 */
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Hanya mengembalikan data dari respons
    if (response.data.status === 'success') {
      return response.data.data;
    }

    // Tangani error dari response backend
    return Promise.reject({
      message: response.data.message,
    });
  },
  (error: AxiosError<ApiResponse<null>>) => {
    if (error.response?.data?.message) {
      const message = error.response.data.message;

      return Promise.reject({
        ...error,
        message,
      });
    }

    return Promise.reject(error);
  },
);

/**
 * Menghapus API context setelah setiap request server-side.
 * Harus dipanggil untuk menghindari context yang tidak valid di request berikutnya.
 */
export const resetApiContext = (): void => {
  apiContext = null;
};

export default api;
