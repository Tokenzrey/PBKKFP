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
import Button from '@/components/buttons/Button';
import { useUploadAndSignMutation } from '../hooks/mutation';

interface PDFSignatureModalProps {
  isVerified: boolean | null;
  setIsVerified: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function PDFSignatureModal({
  isVerified,
  setIsVerified,
}: PDFSignatureModalProps) {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { handleUploadAndSign, isPending } = useUploadAndSignMutation();

  const onSubmit = async (data: any) => {
    const file = data.pdf[0];

    try {
      const response = await handleUploadAndSign({ pdf: file });
      setIsVerified(true);
      console.log('Response:', response);
    } catch (error) {
      console.error('Upload and sign failed:', error);
    }
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button className='max-md:py-3' appearance='outlined'>
          Add PDF Authentication
        </Button>
      </ModalTrigger>
      <ModalContent aria-label='Add Data'>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <ModalHeader>
              <ModalTitle>Add New Data</ModalTitle>
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
