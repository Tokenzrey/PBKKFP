import React from 'react';

import Typography from '@/components/Typography';
import { cn } from '@/lib/cn';

type ErrorMessageProps = {
  /**
   * Pesan error yang akan ditampilkan.
   * Bisa berupa string atau elemen React.
   */
  children: string | React.ReactNode;
  /**
   * Kelas tambahan untuk wrapper utama.
   */
  className?: string;
  /**
   * Kelas tambahan untuk teks error.
   */
  errorTextClassName?: string;
};

/**
 * Komponen ErrorMessage untuk menampilkan pesan error di bawah form input
 * atau elemen lainnya.
 */
export default function ErrorMessage({
  children,
  className = '',
  errorTextClassName = '',
}: ErrorMessageProps) {
  return (
    <div className={cn('flex space-x-1', className)} role='alert'>
      <Typography
        as='p'
        weight='medium'
        variant='b4'
        className={cn(
          'text-sm !leading-tight text-danger-normal',
          errorTextClassName,
        )}
      >
        {children}
      </Typography>
    </div>
  );
}
