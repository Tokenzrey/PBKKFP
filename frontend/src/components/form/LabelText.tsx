import React, { ReactNode } from 'react';

import Typography from '@/components/Typography';
import { cn } from '@/lib/cn';

type LabelTextProps = {
  /**
   * Konten label yang akan ditampilkan.
   */
  children: ReactNode;
  /**
   * Kelas tambahan untuk styling label.
   */
  labelTextClassName?: string;
  /**
   * Apakah field yang dilabeli ini wajib diisi.
   */
  required?: boolean;
  /**
   * ID elemen input yang terkait dengan label.
   */
  htmlFor?: string;
};

/**
 * Komponen LabelText untuk menampilkan label dengan dukungan gaya khusus
 * dan indikator "wajib diisi".
 */
export default function LabelText({
  children,
  labelTextClassName = '',
  required = false,
  htmlFor,
}: LabelTextProps) {
  return (
    <label htmlFor={htmlFor} className='block'>
      <Typography
        as='p'
        variant='b3'
        weight='medium'
        className={cn('text-base text-typo-normal-main', labelTextClassName)}
      >
        {children} {required && <span className='text-danger-normal'>*</span>}
      </Typography>
    </label>
  );
}
