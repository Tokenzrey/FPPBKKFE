'use client';
import React from 'react';

import { useUserProfile } from './hooks/mutation';
import LoadingPage from '@/components/Loading';
import Typography from '@/components/Typography';
import Button from '@/components/buttons/Button';
import { EditProfileModal } from './components/EditModal';

export default function ProfilePage() {
  const { data: user, isLoading, isError, error } = useUserProfile();

  // Handle loading state
  if (isLoading) {
    return <LoadingPage />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <Typography variant='h4' className='text-red-500'>
          Failed to load profile
        </Typography>
        <Typography variant='b1' className='text-gray-500'>
          {error?.message || 'An unknown error occurred'}
        </Typography>
      </div>
    );
  }

  return (
    <div className='container mx-auto mt-8 max-w-2xl px-4'>
      <div className='rounded-lg bg-white p-6 shadow-md'>
        <Typography variant='h4' weight='bold' className='mb-4 text-center'>
          User Profile
        </Typography>
        <div className='flex flex-col items-center gap-4'>
          <Typography variant='h4' weight='semibold'>
            {user?.name}
          </Typography>
          <Typography variant='b1' className='text-gray-600'>
            Email: {user?.email}
          </Typography>
          <Typography variant='b1' className='text-gray-600'>
            Date of Birth: {user?.tanggal_lahir}
          </Typography>
          <Typography variant='b1' className='text-center text-gray-600'>
            {user?.biografi}
          </Typography>
          <EditProfileModal />
        </div>
      </div>
    </div>
  );
}
