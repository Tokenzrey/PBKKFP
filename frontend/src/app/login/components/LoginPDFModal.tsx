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
import LoginWithPDFForm from './PdfForm';
import Button from '@/components/buttons/Button';

export default function LoginPDFModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant='success' className='max-md:py-3' appearance='outlined'>
          Masuk Dengan PDF
        </Button>
      </ModalTrigger>
      <ModalContent aria-label='Add Data'>
        <ModalHeader>
          <ModalTitle>Login VIA PDF</ModalTitle>
        </ModalHeader>
        <LoginWithPDFForm />
      </ModalContent>
    </Modal>
  );
}
