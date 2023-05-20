import React, { FC, ReactElement } from 'react';
import { FieldError } from 'react-hook-form';

interface InputWrapperProps {
  label?: string;
  info?: string;
  name?: string;
  error?: FieldError;
  children: ReactElement<HTMLInputElement> | ReactElement<HTMLTextAreaElement>;
}

export const InputWrapper: FC<InputWrapperProps> = ({
  label,
  name,
  info,
  error,
  children,
}) => {
  return (
    <div className={'flex w-full flex-col'}>
      {label && (
        <label htmlFor={name} className={'font-semibold'}>
          {label}
        </label>
      )}

      {info && <small className={'text-gray-500'}>{info}</small>}
      {children}
      {error && <small className={'text-red-500'}>{error.message}</small>}
    </div>
  );
};
