import React, { useState, useRef } from 'react';
import type { IconType } from '@icons-pack/react-simple-icons';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { get, RegisterOptions, useFormContext } from 'react-hook-form';

import ErrorMessage from '@/components/form/ErrorMessage';
import HelperText from '@/components/form/HelperText';
import LabelText from '@/components/form/LabelText';
import Typography from '@/components/Typography';
import { cn } from '@/lib/cn';

export type InputProps = {
  id: string;
  label?: string;
  helperText?: React.ReactNode;
  helperTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  prefix?: string;
  suffix?: string;
  prefixClassName?: string;
  suffixClassName?: string;
  rightIcon?: LucideIcon | IconType;
  leftIcon?: LucideIcon | IconType;
  rightIconClassName?: string;
  leftIconClassName?: string;
} & React.ComponentPropsWithoutRef<'input'>;

const Input: React.FC<InputProps> = ({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  prefix,
  suffix,
  prefixClassName,
  suffixClassName,
  className,
  type = 'text',
  readOnly = false,
  rightIcon: RightIcon,
  leftIcon: LeftIcon,
  rightIconClassName,
  leftIconClassName,
  helperTextClassName,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const error = get(errors, id);

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className='w-full space-y-2'>
      {label && (
        <LabelText required={validation?.required ? true : false}>
          {label}
        </LabelText>
      )}

      <div className='relative flex w-full gap-0'>
        <div
          className={cn(
            'pointer-events-none absolute h-full w-full rounded-md ring-inset',
          )}
        />

        {prefix && (
          <Typography
            variant='l3'
            className={cn(
              'flex items-center rounded-l-md border-r bg-grey-purple-100 px-3 text-sm font-semibold text-grey-purple-800',
              prefixClassName,
            )}
          >
            {prefix}
          </Typography>
        )}

        <div
          className={cn(
            'relative w-full rounded-xl',
            prefix && 'rounded-l-md',
            suffix && 'rounded-r-md',
          )}
        >
          {LeftIcon && (
            <div
              className={cn(
                'absolute left-0 top-0 h-full',
                'flex items-center justify-center pl-2.5',
                'text-lg text-grey-purple-700 md:text-xl',
                leftIconClassName,
              )}
            >
              <LeftIcon />
            </div>
          )}

          <input
            {...register(id, validation)}
            ref={inputRef} // Memanfaatkan useRef untuk mengikat ref
            type={
              type === 'password'
                ? showPassword
                  ? 'text'
                  : 'password'
                : type
            }
            id={id}
            name={id}
            readOnly={readOnly}
            disabled={readOnly}
            className={cn(
              'h-full w-full rounded-md px-3 py-2.5 caret-info-active',
              LeftIcon && 'pl-9',
              RightIcon && 'pr-9',
              'focus:outline-1 focus:outline-info-active focus:ring-inset',
              'bg-grey-purple-100 text-sm',
              'hover:ring-1 hover:ring-inset hover:ring-info-active',
              'placeholder:font-helvetica placeholder:text-sm placeholder:font-semibold placeholder:text-grey-purple-800',
              'text-typo-normal-main',
              readOnly && 'cursor-not-allowed',
              error &&
                'border-none bg-danger-light ring-2 ring-inset ring-danger-normal placeholder:text-grey-purple-800',
              prefix && 'rounded-l-none rounded-r-md',
              suffix && 'rounded-l-md rounded-r-none',
              prefix && suffix && 'rounded-none',
              className,
            )}
            aria-describedby={id}
            {...rest}
          />

          {RightIcon && type !== 'password' && (
            <div
              className={cn(
                'absolute bottom-0 right-0 h-full',
                'flex items-center justify-center pr-2.5',
                'text-lg text-grey-purple-700 md:text-xl',
                rightIconClassName,
              )}
            >
              <RightIcon />
            </div>
          )}

          {type === 'password' && (
            <div
              className={cn(
                'absolute bottom-0 right-0 h-full',
                'flex items-center justify-center pr-3',
                'text-lg text-grey-purple-800 md:text-xl',
                rightIconClassName,
              )}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          )}
        </div>
        {suffix && (
          <Typography
            variant='l3'
            className={cn(
              'flex w-min items-center rounded-r-md border-l bg-grey-purple-100 px-3 text-sm font-semibold text-grey-purple-800',
              suffixClassName,
            )}
          >
            {suffix}
          </Typography>
        )}
      </div>

      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {helperText && (
        <HelperText helperTextClassName={helperTextClassName}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
};

export default Input;
