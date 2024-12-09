'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/dialog';
import { useUserProfile, useUpdateUser } from '../hooks/mutation';

export const EditProfileModal = ({
  modalWidth = 'max-w-xl',
}: {
  modalWidth?: string;
}) => {
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { mutateAsync: handleUpdateUser, isPending: isUpdating } =
    useUpdateUser();

  // Initialize React Hook Form with default values
  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      tanggal_lahir: '',
      biografi: '',
    },
  });

  const { handleSubmit, reset, setValue } = methods;
  const [isOpen, setIsOpen] = useState(false);

  // Populate form fields with user profile data when it becomes available
  useEffect(() => {
    if (userProfile) {
      setValue('name', userProfile.name);
      setValue('email', userProfile.email);
      setValue('tanggal_lahir', userProfile.tanggal_lahir);
      setValue('biografi', userProfile.biografi);
    }
  }, [userProfile, setValue]);

  // Form submission handler
  const onSubmit = async (data: any) => {
    try {
      await handleUpdateUser(data); // Call mutation to update user profile
      setIsOpen(false); // Close the modal on success
      reset(data); // Reset form fields with updated values
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>
        <Button className='bg-blue-500 text-white hover:bg-blue-600'>
          Edit Profile
        </Button>
      </ModalTrigger>
      <ModalContent
        className={`w-full ${modalWidth}`}
        parentContainerClassName='w-full flex items-center justify-center'
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <ModalHeader className='mb-2 pb-3'>
              <ModalTitle>Edit Profile</ModalTitle>
            </ModalHeader>
            <div className='space-y-4'>
              <Input
                id='name'
                label='Name'
                placeholder='Enter your name'
                validation={{
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                  maxLength: { value: 50, message: 'Maximum 50 characters' },
                }}
              />
              <Input
                id='email'
                label='Email'
                placeholder='Enter your email'
                type='email'
                validation={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email format',
                  },
                }}
              />
              <Input
                id='tanggal_lahir'
                label='Date of Birth'
                placeholder='YYYY-MM-DD'
                type='date'
                validation={{
                  required: 'Date of birth is required',
                }}
              />
              <Input
                id='biografi'
                label='Biography'
                placeholder='Write about yourself'
                type='textarea'
                validation={{
                  maxLength: {
                    value: 500,
                    message: 'Maximum 500 characters',
                  },
                }}
              />
            </div>
            <ModalFooter className='pt-3'>
              <Button
                type='button'
                onClick={() => setIsOpen(false)}
                className='mr-2'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='info'
                disabled={isUpdating || isLoadingProfile}
                className='bg-blue-500 text-white hover:bg-blue-600'
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
};
