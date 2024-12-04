'use client';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/dialog';
import ErrorMessage from '@/components/form/ErrorMessage';
import { useVerifySignatureMutation } from '../hooks/mutation';
import IconButton from '@/components/buttons/IconButton';
import { SquarePen } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function VerifyModal() {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { handleVerifySignature, isPending } = useVerifySignatureMutation();

  const onSubmit = async (data: any) => {
    const file = data.pdf[0];

    try {
      const response = await handleVerifySignature({ pdf: file });

      // More robust handling of verification response
      if (response?.data === true) {
        // Explicitly check for true to confirm successful verification
        showToast('Success', 'Signature verified successfully', 'SUCCESS');
      } else {
        // If response is false or undefined, show error
        showToast('Error', 'Signature verification failed', 'ERROR');
      }

      console.log('Verification Response:', response);
    } catch (error: any) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error
        const errorMessage =
          error.response.data?.message || 'Signature verification failed';
        showToast('Error', errorMessage, 'ERROR');
      } else if (error.request) {
        // Request was made but no response received
        showToast('Error', 'No response from server', 'ERROR');
      } else {
        // Something happened in setting up the request
        showToast('Error', 'Error in signature verification process', 'ERROR');
      }
      console.error('Verification failed:', error);
    }
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <IconButton Icon={SquarePen} variant='success' />
      </ModalTrigger>
      <ModalContent aria-label='Verify Data'>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <ModalHeader>
              <ModalTitle>Verify Data</ModalTitle>
            </ModalHeader>
            <ModalDescription asChild>
              <div>
                <label
                  htmlFor='pdf'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Upload PDF
                </label>
                <input
                  type='file'
                  {...register('pdf', {
                    required: 'PDF file is required',
                    validate: {
                      isPDF: (fileList: FileList) => {
                        if (!fileList || fileList.length === 0) {
                          return 'Please select a PDF file';
                        }

                        const file = fileList[0];

                        // Check file type
                        if (file.type !== 'application/pdf') {
                          return 'Only PDF files are allowed';
                        }

                        // Check file size (10MB limit)
                        if (file.size > 10 * 1024 * 1024) {
                          return 'File size must not exceed 10 MB';
                        }

                        return true;
                      },
                    },
                  })}
                  id='pdf'
                  accept='.pdf'
                  className={`mt-1 block w-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100 ${
                    errors.pdf ? 'border-2 border-red-500' : ''
                  }`}
                />
                {/* Specific PDF Error Handling */}
                {errors.pdf && (
                  <ErrorMessage>{errors.pdf.message as string}</ErrorMessage>
                )}
              </div>
            </ModalDescription>
            <ModalFooter>
              <button
                type='submit'
                disabled={isPending}
                className={`rounded px-4 py-2 font-bold text-white ${
                  isPending ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'
                }`}
              >
                {isPending ? 'Submitting...' : 'Submit'}
              </button>
              <ModalClose asChild>
                <button className='rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700'>
                  Close
                </button>
              </ModalClose>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
