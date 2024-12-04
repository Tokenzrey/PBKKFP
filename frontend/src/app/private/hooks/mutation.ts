import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import api from '@/lib/api';
import { ApiError } from '@/types/api';
import { showToast } from '@/components/Toast';

interface UploadAndSignRequest {
  pdf: File;
}
interface UploadAndSignResponse {
  file: Blob;
  fileName: string;
}
interface VerifyResponse {
  message: string;
  data: boolean; 
}
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPE = 'application/pdf';

export const useUploadAndSignMutation = () => {
  const { mutateAsync: handleUploadAndSign, isPending } = useMutation<
    UploadAndSignResponse,
    AxiosError<ApiError>,
    UploadAndSignRequest
  >({
    mutationFn: async (
      data: UploadAndSignRequest,
    ): Promise<UploadAndSignResponse> => {
      const { pdf } = data;

      // Validasi tipe file
      if (pdf.type !== ALLOWED_MIME_TYPE) {
        throw new Error('File must be a valid PDF.');
      }

      // Validasi ukuran file
      const fileSizeMB = pdf.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        throw new Error(`File size must not exceed ${MAX_FILE_SIZE_MB} MB.`);
      }

      const formData = new FormData();
      formData.append('file', pdf);

      try {
        const response: AxiosResponse<Blob> = await api.post(
          '/pdf-signature/upload-and-sign',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
          },
        );

        // Handle download
        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'signed_document.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        return { file: response.data, fileName: 'signed_document.pdf' };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data instanceof Blob
              ? await error.response.data.text()
              : error.response?.data?.message ||
                'Failed to upload and sign the PDF.';

          console.error('Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: errorMessage,
          });
          showToast('Error', errorMessage, 'ERROR');
          throw new Error(errorMessage);
        }

        console.error('Unexpected error:', error);
        throw new Error('Unexpected error occurred');
      }
    },
    onSuccess: () => {
      // Pastikan showToast dipanggil dengan benar
      setTimeout(() => {
        showToast(
          'Success',
          'PDF uploaded and signed successfully!',
          'SUCCESS',
        );
      }, 100);
    },
    onError: async (error: AxiosError<{ message: string }>) => {
      let errorMessage = 'Failed to upload and sign the PDF.';

      if (error.response?.data instanceof Blob) {
        // Jika error response adalah Blob, coba parsing teks
        try {
          errorMessage = await error.response.data.text();
        } catch (parseError) {
          console.error('Failed to parse error blob:', parseError);
        }
      } else {
        errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to upload and sign the PDF.';
      }

      console.error('Upload error:', error);

      // Tambahkan delay untuk memastikan toast dapat ditampilkan
      setTimeout(() => {
        showToast('Error', errorMessage, 'ERROR');
      }, 100);
    },
  });

  return { handleUploadAndSign, isPending };
};

export const useVerifySignatureMutation = () => {
  const mutation = useMutation<
    VerifyResponse, // Response type
    AxiosError<ApiError>, // Error type
    UploadAndSignRequest // Request type
  >({
    mutationFn: async (
      formData: UploadAndSignRequest,
    ): Promise<VerifyResponse> => {
      const data = new FormData(); // Buat FormData baru
      data.append('file', formData.pdf); // Tambahkan file PDF

      const response = await api.post<VerifyResponse>(
        '/pdf-signature/verify',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data; // Return response data
    },
  });

  return {
    handleVerifySignature: mutation.mutateAsync, // Untuk memanggil mutasi
    isPending: mutation.isPending, // Status pemuatan
  };
};
