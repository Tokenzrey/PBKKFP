'use client';
import React, { useState } from 'react';
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
import NextImage from '@/components/NextImage';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';

interface DecryptedData {
  image: string;
  name: string;
  fileName: string;
  description: string;
}
interface SeekDataModalProps {
  blogId: number | null;
  children: React.ReactNode;
}
export default function SeekDataModal({
  blogId,
  children,
}: SeekDataModalProps) {
  const methods = useForm<{ encrypted_key: string }>({
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const [decryptedData, setDecryptedData] = useState<DecryptedData | null>(
    null,
  );

  // Function to handle form submission
  const onSubmit = async (data: { encrypted_key: string }) => {
    try {
      const response = await api.get(
        `/blog/decrypt-blog?id_blogs=${blogId}&encrypt_key=${data.encrypted_key}`,
      );
      if (response.data.success) {
        setDecryptedData({
          image: response.data.data.file, // base64 image
          name: response.data.data.nama,
          fileName: response.data.data.nama_file,
          description: response.data.data.description,
        });
        showToast('Success', 'Data decrypted successfully', 'SUCCESS');
      } else {
        showToast(
          'Error',
          response.data.message || 'Failed to decrypt data',
          'ERROR',
        );
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
      showToast('Error', 'Failed to decrypt data. Please try again.', 'ERROR');
    }
  };

  return (
    <Modal>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent aria-label='Seek Data'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-2 gap-4 space-y-4'
          >
            <div>
              <ModalHeader>
                <ModalTitle>Seek Data</ModalTitle>
              </ModalHeader>
              <ModalDescription>
                <Input
                  id='encrypted_key'
                  label='Encrypted Key'
                  type='text'
                  validation={{ required: 'Encrypted Key is required' }}
                  {...register('encrypted_key')}
                />
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
            </div>
            {/* Display decrypted data on the right */}
            <div className='flex flex-col items-center'>
              {decryptedData ? (
                <>
                  <img
                    src={`data:image/png;base64,${decryptedData.image}`}
                    alt={decryptedData.name}
                    width={300}
                    height={200}
                    className='rounded-md'
                  />
                  <h3 className='mt-4 text-lg font-semibold'>
                    {decryptedData.name}
                  </h3>
                  <p className='text-gray-500'>{decryptedData.fileName}</p>
                  <p className='mt-2 text-gray-700'>
                    {decryptedData.description}
                  </p>
                </>
              ) : (
                <p className='text-gray-500'>No data to display</p>
              )}
            </div>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
