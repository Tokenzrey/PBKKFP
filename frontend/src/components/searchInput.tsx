// SearchInput.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

const SearchVariant = [
  'info',
  'danger',
  'warning',
  'success',
  'disabled',
  'outlined',
  'blue',
] as const;

const SearchAppearance = ['light', 'normal', 'dark', 'outlined'] as const;
const SearchSize = ['small', 'medium', 'large'] as const;

interface SearchInputProps {
  input: string;
  setInput: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: (typeof SearchVariant)[number];
  appearance?: (typeof SearchAppearance)[number];
  size?: (typeof SearchSize)[number];
}

const SearchInput: React.FC<SearchInputProps> = ({
  input,
  setInput,
  className,
  placeholder = 'Search...',
  variant = 'success',
  appearance = 'outlined',
  size = 'medium',
}) => {
  return (
    <div className={cn('relative w-full', className)}>
      <Search
        className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400'
        size={20}
      />
      <input
        type='text'
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        className={cn(
          'w-full rounded-lg py-2 pl-10 pr-4 placeholder:font-normal focus:outline-none focus:ring-2',
          // Size classes
          [
            size === 'large' && 'py-3 pl-12 text-lg',
            size === 'medium' && 'py-2 pl-10 text-base',
            size === 'small' && 'py-1 pl-8 text-sm',
          ],
          // Variant classes
          [
            variant === 'info' && [
              appearance === 'light' && 'bg-info-light text-info-dark',
              appearance === 'normal' && 'bg-info-normal text-white',
              appearance === 'dark' && 'bg-info-dark text-white',
              appearance === 'outlined' &&
                'border-info-normal text-info-normal border-2',
            ],
            variant === 'success' && [
              appearance === 'light' && 'bg-success-light text-success-dark',
              appearance === 'normal' && 'bg-success-normal text-white',
              appearance === 'dark' && 'bg-success-dark text-white',
              appearance === 'outlined' &&
                'border-success-normal text-success-normal border-2',
            ],
            variant === 'danger' && [
              appearance === 'light' && 'bg-danger-light text-danger-dark',
              appearance === 'normal' && 'bg-danger-normal text-white',
              appearance === 'dark' && 'bg-danger-dark text-white',
              appearance === 'outlined' &&
                'border-danger-normal text-danger-normal border-2',
            ],
            variant === 'warning' && [
              appearance === 'light' && 'bg-warning-light text-warning-dark',
              appearance === 'normal' && 'bg-warning-normal text-yellow-900',
              appearance === 'dark' && 'bg-warning-dark text-white',
              appearance === 'outlined' &&
                'border-warning-normal text-warning-normal border-2',
            ],
            variant === 'blue' && [
              appearance === 'light' && 'bg-blue-100 text-blue-900',
              appearance === 'normal' && 'bg-blue-500 text-white',
              appearance === 'dark' && 'bg-blue-900 text-white',
              appearance === 'outlined' &&
                'border-2 border-blue-500 text-blue-500',
            ],
            variant === 'disabled' &&
              'cursor-not-allowed bg-gray-200 text-gray-500',
          ],
        )}
      />
    </div>
  );
};

export default SearchInput;
