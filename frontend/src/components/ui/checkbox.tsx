'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

import { cn } from '@/lib/cn';

export const CheckboxVariant = [
  'default',
  'red',
  'green',
  'blue',
  'yellow',
] as const;

export type CheckboxProps = {
  variant?: (typeof CheckboxVariant)[number];
} & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & CheckboxProps
>(({ className, variant = 'default', ...props }, ref) => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
    'indeterminate',
  );

  const handleClick = () => {
    if (checked === 'indeterminate') {
      setChecked(true);
    } else {
      setChecked(!checked);
    }
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={handleClick}
      className={cn(
        'group peer h-4 w-4 shrink-0 rounded-[5px]',
        'mt-0.5 ring-[1.5px]',
        [
          variant === 'default' && ['bg-purple-100 ring-purple-50'],
          variant === 'red' && ['bg-tomato-red-100 ring-tomato-red-50'],
          variant === 'green' && ['bg-green-100 ring-green-50'],
          variant === 'blue' && ['bg-light-blue-100 ring-light-blue-50'],
          variant === 'yellow' && ['bg-yellow-100 ring-yellow-50'],
        ],
        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current')}
      >
        <div
          className={cn(
            'hidden h-3.5 w-3.5 rounded-[5px] group-data-[state=checked]:block',
            [
              variant === 'default' && ['bg-purple-500'],
              variant === 'red' && ['bg-tomato-red-500'],
              variant === 'green' && ['bg-green-500'],
              variant === 'blue' && ['bg-light-blue-700'],
              variant === 'yellow' && ['bg-yellow-400'],
            ],
          )}
        />
        <div
          className={cn(
            'hidden h-1 w-3.5 rounded-md group-data-[state=indeterminate]:block',
            [
              variant === 'default' && ['bg-purple-500'],
              variant === 'red' && ['bg-tomato-red-500'],
              variant === 'green' && ['bg-green-500'],
              variant === 'blue' && ['bg-light-blue-700'],
              variant === 'yellow' && ['bg-yellow-400'],
            ],
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
