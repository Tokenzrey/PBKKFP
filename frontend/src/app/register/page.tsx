import * as React from 'react';

import RegisterForm from '@/app/register/components/registerForm';
import withAuth from '@/lib/Auth/withAuth';
import NextImage from '@/components/NextImage';
import Typography from '@/components/Typography';

// export default withAuth(LoginPage, 'auth');
export default function LoginPage() {
  return (
    <main
      id='login'
      className='m-0 flex min-h-screen items-center justify-center gap-4 p-2 lg:h-screen lg:flex-row lg:px-8 lg:py-5'
    >
      <div
        className='relative flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] lg:w-2/5 lg:rounded-[40px]'
        id='form'
      >
        <div className='relative z-20 flex h-full w-full flex-col items-center justify-evenly gap-10 rounded-[40px] px-8 py-20 lg:justify-center'>
          <div className='flex flex-col items-center justify-center gap-2.5'>
            <Typography
              as='h1'
              variant='h3'
              weight='bold'
              className='text-typo-normal-black text-3xl'
            >
              REGISTER
            </Typography>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
