import React from 'react';

import Typography from '@/components/Typography';
import { cn } from '@/lib/cn';

type HelperTextProps = {
  /**
   * Konten helper text yang akan ditampilkan.
   */
  children: React.ReactNode;
  /**
   * Kelas tambahan untuk wrapper utama.
   */
  className?: string;
  /**
   * Kelas tambahan khusus untuk teks helper.
   */
  helperTextClassName?: string;
};

/**
 * Komponen HelperText untuk menampilkan pesan bantuan atau informasi tambahan
 * di bawah form input atau elemen lainnya.
 */
export default function HelperText({
  children,
  className = '',
  helperTextClassName = '',
}: HelperTextProps) {
  return (
    <div className={cn('flex space-x-1', className)} role='note'>
      <Typography
        as='p'
        weight='medium'
        variant='b3'
        className={cn(
          'text-base !leading-tight text-grey-purple-800',
          helperTextClassName,
        )}
      >
        {children}
      </Typography>
    </div>
  );
}
