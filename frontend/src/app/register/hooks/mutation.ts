import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios'; // Corrected import statement for axios
import { useRouter, useSearchParams } from 'next/navigation';

import { showToast } from '@/components/Toast';
import api from '@/lib/api';
import { ApiError, ApiSuccess, RegisterFormResponse } from '@/types/api';
import { RegisterFormRequest } from '@/types/login';

export const useRegisterMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutateAsync: handleRegister, isPending } = useMutation<
    RegisterFormResponse,
    AxiosError<ApiError>, // Properly annotated error type
    RegisterFormRequest
  >({
    mutationFn: async (
      data: RegisterFormRequest,
    ): Promise<RegisterFormResponse> => {
      try {
        const response: AxiosResponse<RegisterFormResponse> =
          await api.post<RegisterFormResponse>('/auth/register', data);

        // Handle the response data for successful registration
        if (response.data.success) {
          const { message } = response.data as ApiSuccess;
          showToast(
            'Register success!',
            message || 'You have successfully registered!',
            'SUCCESS',
          );
          return response.data;
        } else {
          const errorMessage =
            response.data.message || 'Unsuccessful registration.';
          showToast('Register Failed', errorMessage, 'ERROR');
          throw new Error(errorMessage);
        }
      } catch (error: unknown) {
        // Specify that the type of error is unknown
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiError>; // Use type assertion for AxiosError
          throw new Error(
            axiosError.response?.data.message ||
              'Registration failed. Please try again.',
          );
        }
        throw new Error('An unexpected error occurred');
      }
    },
    onSuccess: () => {
      // Optional: Redirect after successful registration
      const redirect = searchParams.get('redirect') || '/login'; // Redirect to login or another page
      router.push(redirect);
    },
    onError: (err: AxiosError<ApiError>) => {
      // Properly annotate the type of err
      // Handle errors that occur during the registration process
      if (err.response?.data.errors) {
        const errorMessage = Object.values(err.response.data.errors).join(', ');
        showToast('Registration Failed', errorMessage, 'ERROR');
      } else {
        showToast(
          'Registration Failed',
          err.response?.data.message ||
            'An error occurred during registration. Please try again.',
          'ERROR',
        );
      }
    },
  });

  return { handleRegister, isPending };
};
