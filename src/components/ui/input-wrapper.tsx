import React, { FC, ReactElement, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

interface InputWrapperProps {
  label?: string;
  info?: string;
  name?: string;
  error?: FieldError;
  tooltip?: ReactNode;
  children: ReactElement<HTMLInputElement> | ReactElement<HTMLTextAreaElement>;
}

export const InputWrapper: FC<InputWrapperProps> = ({
  label,
  name,
  info,
  error,
  tooltip,
  children,
}) => {
  return (
    <div className={'flex w-full flex-col'}>
      <div className={'flex flex-row items-center'}>
        <div className={'flex w-full flex-col'}>
          {label && (
            <label htmlFor={name} className={'font-semibold'}>
              {label}
            </label>
          )}
          {info && <small className={'text-gray-500'}>{info}</small>}
        </div>
        {tooltip && <div className={'ml-auto'}>{tooltip}</div>}
      </div>
      {children}
      {error && (
        <small className={'ml-0.5 mt-1 text-red-500'}>{error.message}</small>
      )}
    </div>
  );
};
