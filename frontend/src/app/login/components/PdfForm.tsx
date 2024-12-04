'use client';

import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useLoginWithPDFMutation } from '@/app/login/hooks/mutation';
import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import ErrorMessage from '@/components/form/ErrorMessage';
import { LoginWithPDFRequest } from '@/app/login/hooks/mutation';

export default function LoginWithPDFForm() {
  // Tetapkan tipe untuk useForm
  const methods = useForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { handleLoginWithPDF, isPending } = useLoginWithPDFMutation();

  const onSubmit = (data: any) => {
    const pdfFile = data.pdf[0]; // Ambil file pertama dari FileList
    const account_name = data.account_name;

    if (!pdfFile || !account_name) {
      console.error('Account name and PDF file are required');
      return;
    }

    if (pdfFile) {
      handleLoginWithPDF({ pdf: pdfFile, account_name: account_name });
    } else {
      console.error('No PDF file selected');
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto flex w-full flex-col items-center justify-center gap-5 md:w-[85%]'
      >
        <div className='w-full'>
          <Input
            id='account_name'
            label='Username'
            className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
            placeholder='Masukkan username'
            validation={{
              required: 'username tidak boleh kosong!',
            }}
            {...register('account_name', { required: 'Username is required!' })}
          />
        </div>
        <div className='w-full'>
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

        <Button
          type='submit'
          variant='info'
          className='mt-4 w-full rounded-lg bg-blue-400 py-2 text-typo-normal-white hover:bg-blue-500'
          isLoading={isPending}
        >
          Masuk
        </Button>
      </form>
    </FormProvider>
  );
}
