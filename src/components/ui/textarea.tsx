import * as React from 'react';
import { cn } from '@utils/classNames';
import { InputWrapper } from '@components/ui/input-wrapper';
import { FieldError } from 'react-hook-form';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    info?: string;
    error?: FieldError;
  };
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <InputWrapper
        error={error}
        label={props.label}
        info={props.info}
        name={props.name}
      >
        <textarea
          className={cn(
            'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
      </InputWrapper>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
