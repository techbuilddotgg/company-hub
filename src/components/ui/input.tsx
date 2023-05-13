import * as React from 'react';
import { cn } from '@utils/classNames';
import { forwardRef, InputHTMLAttributes } from 'react';
import { InputWrapper } from '@components/ui/input-wrapper';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  info?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, info, ...props }, ref) => {
    return (
      <InputWrapper label={label} name={props.name} info={info}>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
      </InputWrapper>
    );
  },
);
Input.displayName = 'Input';

export { Input };
