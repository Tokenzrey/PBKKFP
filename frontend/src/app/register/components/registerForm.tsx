'use client';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useRegisterMutation } from '@/app/register/hooks/mutation';
import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import { RegisterFormRequest } from '@/types/login';

export default function RegisterForm() {
  const methods = useForm<RegisterFormRequest>({
    mode: 'onTouched',
  });

  const { handleSubmit, setError, register, watch } = methods;

  const { handleRegister, isPending } = useRegisterMutation();

  const onSubmit = (data: RegisterFormRequest) => {
    // Check if passwords match before making the API request
    if (data.password !== data.confirm_password) {
      setError('confirm_password', {
        type: 'manual',
        message: 'Passwords do not match!',
      });
      return;
    }

    handleRegister({
      ...data,
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto flex w-full flex-col items-center justify-center gap-5 md:w-[85%]'
      >
        <Input
          id='account_name'
          label='Username'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          placeholder='Masukkan username'
          validation={{
            required: 'Username tidak boleh kosong!',
          }}
          {...register('account_name', { required: 'Username is required!' })}
        />

        <Input
          label='Password'
          id='password'
          type='password'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          placeholder='Masukkan Password'
          validation={{
            required: 'Password tidak boleh kosong!',
          }}
          {...register('password', { required: 'Password is required!' })}
        />

        <Input
          label='Confirm Password'
          id='confirm_password'
          type='password'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          placeholder='Konfirmasi Password'
          validation={{
            required: 'Konfirmasi password tidak boleh kosong!',
            validate: (value) =>
              value === watch('password') || 'Passwords do not match!',
          }}
          {...register('confirm_password', {
            required: 'Confirm password is required!',
          })}
        />

        <Input
          label='Government ID'
          id='govermentid'
          type='text'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          placeholder='Enter government ID'
          validation={{
            required: 'Government ID is required!',
            pattern: {
              value: /^[0-9]{16}$/,
              message: 'Government ID must be 16 digits',
            },
          }}
          {...register('govermentid', {
            required: 'Goverment ID is required!',
          })}
        />

        <Input
          label='Date of Birth'
          id='birth_date'
          type='date'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          validation={{
            required: 'Tanggal lahir tidak boleh kosong!',
          }}
          {...register('birth_date', { required: 'Birth Date is required!' })}
        />

        <Button
          type='submit'
          variant='info'
          className='mt-4 w-full rounded-lg bg-blue-400 py-2 text-typo-normal-white hover:bg-blue-500'
          isLoading={isPending}
        >
          Daftar
        </Button>
      </form>
    </FormProvider>
  );
}
