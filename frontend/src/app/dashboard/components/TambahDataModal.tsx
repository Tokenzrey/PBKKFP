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
import Input from '@/components/form/Input';
import LabelText from '@/components/form/LabelText';
import ErrorMessage from '@/components/form/ErrorMessage';
import Button from '@/components/buttons/Button';
import { useCreateBlogMutation } from '../hooks/tambahDataMutation';
import { CreateBlogRequest as FormData } from '../hooks/tambahDataMutation';

export default function AddDataModal() {
  const methods = useForm<FormData>({
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const { handleCreateBlog, isPending } = useCreateBlogMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await handleCreateBlog(data);
      reset();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant='success' className='max-md:py-3'>
          Tambah Data
        </Button>
      </ModalTrigger>
      <ModalContent aria-label='Add Data'>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <ModalHeader>
              <ModalTitle>Add New Data</ModalTitle>
            </ModalHeader>
            <ModalDescription>
              <Input
                id='name'
                label='Nama'
                type='text'
                validation={{ required: 'Nama tidak boleh kosong!' }}
                {...register('name', {
                  required: 'name is required!',
                })}
              />
            </ModalDescription>
            <ModalDescription>
              <Input
                id='description'
                label='Deskripsi'
                type='text'
                validation={{ required: 'Deskripsi tidak boleh kosong!' }}
                {...register('description', {
                  required: 'Deskripsi is required!',
                })}
              />
            </ModalDescription>
            <ModalDescription>
              <LabelText required>Gambar :</LabelText>
              <input
                type='file'
                {...register('image', {
                  required: 'File is required',
                  validate: {
                    isImage: (fileList: FileList) => {
                      if (fileList.length > 0) {
                        const file = fileList[0];
                        return (
                          /image\/(jpeg|png)$/.test(file.type) ||
                          'Only JPG or PNG files are allowed!'
                        );
                      }
                      return 'File is required';
                    },
                  },
                })}
                id='image'
                className='mt-1 block w-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100'
              />
              {errors.image && (
                <ErrorMessage>{errors.image.message}</ErrorMessage>
              )}
            </ModalDescription>
            <ModalFooter>
              <button
                type='submit'
                className='rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
              >
                Submit
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
