import * as React from 'react';
import { get, RegisterOptions, useFormContext } from 'react-hook-form';

import ErrorMessage from '@/components/form/ErrorMessage';
import HelperText from '@/components/form/HelperText';
import LabelText from '@/components/form/LabelText';
import Typography from '@/components/Typography';
import { cn } from '@/lib/cn';

export type TextAreaProps = {
  id: string;
  label?: string;
  helperText?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  containerClassName?: string;
} & React.ComponentPropsWithoutRef<'textarea'>;

export default function TextArea({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  className,
  containerClassName,
  maxLength = 1000,
  readOnly = false,
  ...rest
}: TextAreaProps) {
  const [value, setValue] = React.useState('');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);
  const textArea = register(id, validation);

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    textArea.onChange(e);
    setValue(e.currentTarget.value);
  };

  return (
    <div className={cn('w-full space-y-1.5', containerClassName)}>
      {label && (
        <LabelText required={validation?.required ? true : false}>
          {label}
        </LabelText>
      )}

      <div className='relative'>
        <textarea
          {...textArea}
          id={id}
          name={id}
          readOnly={readOnly}
          disabled={readOnly}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            'h-full w-full rounded-md border border-[#808080] px-2.5 py-2.5 ',
            'text-sm',
            'focus:outline-primary-info-active focus:outline-1 focus:ring-inset',
            'hover:ring-1 hover:ring-inset hover:ring-[#000]',
            'placeholder:text-sm placeholder:text-[#9AA2B1] focus:placeholder:text-[#092540]',
            readOnly && 'cursor-not-allowed',
            error &&
              'bg-danger-border-2 ring-danger-main focus:ring-danger-main border-none ring-2 ring-inset placeholder:text-[#092540]',
            className,
          )}
          aria-describedby={id}
          {...rest}
        />

        <Typography
          as='p'
          variant='b3'
          className='absolute bottom-2.5 right-6 text-xs'
        >
          {value.length}/{maxLength}
        </Typography>
      </div>

      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
}
