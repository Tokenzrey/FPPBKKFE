'use client';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import axios from 'axios';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import { ApiResponse } from '@/types/api';
import { RegisterFormRequest, RegisterFormResponse } from '@/types/login';
import { showToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  // Inisialisasi react-hook-form dengan validasi mode "onTouched"
  const methods = useForm<RegisterFormRequest>({
    mode: 'onTouched',
  });
  const router = useRouter();
  const { handleSubmit, setError, watch } = methods;

  /**
   * Fungsi untuk menangani pengiriman formulir
   */
  const onSubmit = async (data: RegisterFormRequest) => {
    // Validasi lokal: pastikan password dan confirm_password cocok
    if (data.password !== data.confirm_password) {
      setError('confirm_password', {
        type: 'manual',
        message: 'Passwords do not match!',
      });
      return;
    }

    try {
      // Kirim data ke API
      const response = await axios.post<ApiResponse<RegisterFormResponse>>(
        '/api/signup',
        {
          name: data.name,
          email: data.email,
          password: data.password,
          tanggal_lahir: data.tanggal_lahir,
          biografi: data.biografi,
        },
      );

      // Periksa apakah respons sukses
      if (response.data.status === 'success') {
        showToast('Registration Successful', 'You can now log in!', 'SUCCESS');
        router.push('/login');
        console.log('Registration Successful:', response.data.data);
      } else {
        showToast('Registration Failed', response.data.message, 'ERROR');
      }
    } catch (error: any) {
      // Tangani error dari API
      const message =
        error.response?.data?.message ||
        'An error occurred during registration';
      showToast('Registration Failed', message, 'ERROR');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
        {/* Nama */}
        <Input
          id='name'
          label='Full Name'
          placeholder='Masukkan nama lengkap'
          validation={{ required: 'Nama lengkap tidak boleh kosong!' }}
        />

        {/* Email */}
        <Input
          id='email'
          label='Email'
          type='email'
          placeholder='Masukkan alamat email'
          validation={{
            required: 'Email tidak boleh kosong!',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format email tidak valid!',
            },
          }}
        />

        {/* Password */}
        <Input
          id='password'
          label='Password'
          type='password'
          placeholder='Masukkan password'
          validation={{ required: 'Password tidak boleh kosong!' }}
        />

        {/* Confirm Password */}
        <Input
          id='confirm_password'
          label='Confirm Password'
          type='password'
          placeholder='Konfirmasi password'
          validation={{
            required: 'Konfirmasi password tidak boleh kosong!',
            validate: (value) =>
              value === watch('password') || 'Passwords do not match!',
          }}
        />

        {/* Tanggal Lahir */}
        <Input
          id='tanggal_lahir'
          label='Date of Birth'
          type='date'
          validation={{ required: 'Tanggal lahir tidak boleh kosong!' }}
        />

        {/* Biografi */}
        <Input
          id='biografi'
          label='Biography'
          placeholder='Masukkan biografi singkat'
          validation={{ required: 'Biografi tidak boleh kosong!' }}
        />

        {/* Tombol Submit */}
        <Button
          type='submit'
          variant='info'
          className='mt-4 w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600'
        >
          Daftar
        </Button>
      </form>
    </FormProvider>
  );
}
