import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

import { showToast } from '@/components/Toast';
import api from '@/lib/api';
import { setToken } from '@/lib/cookies';
import useAuthStore from '@/lib/Auth/useAuthStore';
import { ApiError, ApiSuccess } from '@/types/api';
import { LoginFormRequest, LoginFormResponse } from '@/types/login';
import { User } from '@/types/entities/user';

export interface LoginWithPDFRequest {
  pdf: File;
  account_name: string;
}

export const useLoginMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const { mutateAsync: handleLogin, isPending } = useMutation<
    LoginFormResponse,
    AxiosError<ApiError>,
    LoginFormRequest
  >({
    mutationFn: async (data: LoginFormRequest): Promise<LoginFormResponse> => {
      try {
        const response: AxiosResponse<ApiSuccess<LoginFormResponse>> =
          await api.post<ApiSuccess<LoginFormResponse>>('/auth/login', data);

        // Check if the response indicates a successful login
        if (response.data.success && response.data.data) {
          const {
            token,
            refresh_token,
            refresh_token_expiration_time,
            token_expiration_time,
          } = response.data.data;

          setToken(token, token_expiration_time);

          // Fetch user details
          const userResponse: AxiosResponse<ApiSuccess<User>> =
            await api.get<ApiSuccess<User>>('/auth/me');

          if (!userResponse.data.success || !userResponse.data.data) {
            return Promise.reject(
              new Error('Failed to retrieve user details.'),
            );
          }

          const userData: User = userResponse.data.data;

          if (!userData.username) {
            return Promise.reject(
              new Error('Username is missing in the response'),
            );
          }

          login({
            ...userData,
            token,
          });

          showToast(
            'Login success!',
            response.data.message || 'Success',
            'SUCCESS',
          );
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || 'Login failed. Please try again.',
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage =
            axiosError.response?.data.message ||
            'Login failed. Please check your credentials and try again.';
          return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(
          new Error('A network error occurred. Please try again.'),
        );
      }
    },
    onSuccess: () => {
      // Redirect after successful login
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    },
    onError: (err: AxiosError<ApiError>) => {
      // Handle errors that occur during the login process
      const errorResponse =
        err.response?.data.message ||
        'Unable to log in. Please check your credentials and try again.';
      showToast('Login Failed', errorResponse, 'ERROR');
    },
  });

  return { handleLogin, isPending };
};

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPE = 'application/pdf';

export const useLoginWithPDFMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const { mutateAsync: handleLoginWithPDF, isPending } = useMutation<
    LoginFormResponse, // Response type for successful login
    AxiosError<ApiError>, // Error type
    LoginWithPDFRequest // Request type
  >({
    mutationFn: async (
      data: LoginWithPDFRequest,
    ): Promise<LoginFormResponse> => {
      try {
        const { pdf, account_name } = data;
        console.log(pdf);

        // Validasi tipe file
        if (pdf.type !== ALLOWED_MIME_TYPE) {
          throw new Error('File must be a valid PDF.');
        }

        // Validasi ukuran file
        const fileSizeMB = pdf.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          throw new Error(`File size must not exceed ${MAX_FILE_SIZE_MB} MB.`);
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('file', pdf);
        formData.append('account_name', account_name);

        // API call to login with PDF
        const response: AxiosResponse<ApiSuccess<LoginFormResponse>> =
          await api.post<ApiSuccess<LoginFormResponse>>(
            '/auth/login-with-pdf',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );

        if (response.data.success && response.data.data) {
          const {
            token,
            refresh_token,
            refresh_token_expiration_time,
            token_expiration_time,
          } = response.data.data;

          // Store token
          setToken(token, token_expiration_time);

          // Fetch user details
          const userResponse: AxiosResponse<ApiSuccess<User>> =
            await api.get<ApiSuccess<User>>('/auth/me');

          if (!userResponse.data.success || !userResponse.data.data) {
            throw new Error('Failed to retrieve user details.');
          }

          const userData: User = userResponse.data.data;

          if (!userData.username) {
            throw new Error('Username is missing in the response.');
          }

          // Update user state
          login({
            ...userData,
            token,
          });

          // Show success toast
          showToast(
            'Login Success!',
            response.data.message || 'Login berhasil!',
            'SUCCESS',
          );

          return response.data.data;
        } else {
          throw new Error(
            response.data.message || 'Login failed. Please try again.',
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage =
            axiosError.response?.data.message ||
            'Login dengan PDF gagal. Periksa file dan akun Anda.';
          throw new Error(errorMessage);
        }
        throw new Error('A network error occurred. Please try again.');
      }
    },
    onSuccess: () => {
      // Redirect after successful login
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    },
    onError: (err: AxiosError<ApiError>) => {
      // Handle login errors
      const errorResponse =
        err.response?.data.message ||
        'Login dengan PDF gagal. Periksa file dan akun Anda.';
      showToast('Login Failed', errorResponse, 'ERROR');
    },
  });

  return { handleLoginWithPDF, isPending };
};
