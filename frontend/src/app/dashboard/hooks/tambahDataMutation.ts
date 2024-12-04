// hooks/mutation.ts
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { showToast } from '@/components/Toast';
import api from '@/lib/api';
import { ApiError, ApiSuccess } from '@/types/api';

export interface CreateBlogRequest {
  name: string;
  description: string;
  image: FileList;
}

export const useCreateBlogMutation = () => {
  const { mutateAsync: handleCreateBlog, isPending } = useMutation<
    ApiSuccess,
    AxiosError<ApiError>,
    CreateBlogRequest
  >({
    mutationFn: async (data: CreateBlogRequest): Promise<ApiSuccess> => {
      try {
        const formData = new FormData();
        formData.append('nama', data.name);
        formData.append('description', data.description);
        formData.append('file', data.image[0]);

        const response: AxiosResponse<ApiSuccess> = await api.post<ApiSuccess>(
          '/blog/create',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.data.success) {
          const { message } = response.data;
          showToast(
            'Success',
            message || 'Blog created successfully!',
            'SUCCESS',
          );
          return response.data;
        } else {
          throw new Error('Blog creation failed');
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiError>;
          throw new Error(
            axiosError.response?.data.message ||
              'Blog creation failed. Please try again.',
          );
        }
        throw new Error('An unexpected error occurred');
      }
    },
    onSuccess: () => {
      // Reload the page after a successful blog creation
      showToast('Success', 'Blog created successfully!', 'SUCCESS');
      window.location.reload();
    },
    onError: (err: AxiosError<ApiError>) => {
      const errorMessage =
        err.response?.data.message ||
        'An error occurred during blog creation. Please try again.';
      showToast('Error', errorMessage, 'ERROR');
    },
  });

  return { handleCreateBlog, isPending };
};
