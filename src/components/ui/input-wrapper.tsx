import React, { FC, ReactElement } from 'react';

interface InputWrapperProps {
  label?: string;
  info?: string;
  name?: string;
  children: ReactElement<HTMLInputElement> | ReactElement<HTMLTextAreaElement>;
}

export const InputWrapper: FC<InputWrapperProps> = ({
  label,
  name,
  info,
  children,
}) => {
  return (
    <div className={'flex w-full flex-col'}>
      {label && (
        <label htmlFor={name} className={'font-semibold'}>
          {label}
        </label>
      )}

      {info && <span className={'text-sm text-gray-500'}>{info}</span>}
      {children}
    </div>
  );
};
