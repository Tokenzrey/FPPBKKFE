'use client';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useLoginMutation } from '@/app/login/hooks/mutation';
import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import { LoginFormRequest } from '@/types/login';

export default function LoginForm() {
  const methods = useForm<LoginFormRequest>({
    mode: 'onTouched',
  });

  const { handleSubmit, register } = methods;

  const { handleLogin, isPending } = useLoginMutation();

  const onSubmit = (data: LoginFormRequest) => {
    handleLogin({
      ...data,
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto flex w-full flex-col items-center justify-center gap-5 md:w-[85%]'
      >
        <Input
          id='email'
          label='Email'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          placeholder='Masukkan email'
          validation={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format email tidak valid!',
            },
            required: 'email tidak boleh kosong!',
          }}
        />

        <Input
          label='Password'
          id='password'
          type='password'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          placeholder='Masukkan Password'
          validation={{
            required: 'Password tidak boleh kosong!',
          }}
        />
        <Button
          type='submit'
          variant='info'
          className='mt-4 w-full rounded-lg bg-blue-400 py-2 text-typo-normal-white hover:bg-blue-500'
          isLoading={isPending}
        >
          Masuk
        </Button>
      </form>
    </FormProvider>
  );
}
