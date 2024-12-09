'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import TextArea from '@/components/form/Textarea';
import { useCreateBlog } from './hooks/mutation';
import withAuth from '@/lib/Auth/withAuth';

export default withAuth(CreateBlogPage, 'auth');
function CreateBlogPage() {
  const methods = useForm();
  const { handleSubmit, register, reset } = methods;

  const { mutateAsync: createBlog, isPending: isCreating } = useCreateBlog();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (data: Record<string, any>) => {
    const formData = new FormData();
    formData.append('judul', data.judul);
    formData.append('content', data.content);
    if (file) {
      formData.append('thumbnail', file);
    }

    try {
      await createBlog(formData);
      reset(); // Clear form on success
      router.push('/dashboard'); // Redirect to dashboard or blogs list
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div className='container mx-auto mt-12 max-w-3xl px-6'>
      <h1 className='text-center text-3xl font-extrabold text-gray-800'>
        Create New Blog
      </h1>
      <p className='mt-2 text-center text-gray-600'>
        Fill in the form below to create a new blog post.
      </p>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-8 space-y-6 rounded-lg bg-white p-6 shadow-lg'
          encType='multipart/form-data'
        >
          {/* Title Field */}
          <Input
            id='judul'
            label='Title'
            placeholder='Enter the blog title'
            validation={{ required: 'Title is required' }}
            className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-blue-500'
          />
          {/* Content Field */}
          <TextArea
            id='content'
            label='Content'
            placeholder='Write your blog content...'
            validation={{ required: 'Content is required' }}
            className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-blue-500'
            rows={6}
          />
          {/* Thumbnail Upload */}
          <div>
            <label
              htmlFor='thumbnail'
              className='block text-sm font-medium text-gray-700'
            >
              Thumbnail Image
            </label>
            <input
              id='thumbnail'
              type='file'
              accept='image/*'
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                }
              }}
              className='mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-blue-500'
            />
            <p className='mt-1 text-sm text-gray-500'>
              JPEG, PNG, or GIF (Max 3MB)
            </p>
          </div>
          {/* Buttons */}
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              onClick={() => router.back()}
              className='rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-800 shadow-sm hover:bg-gray-100'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='info'
              disabled={isCreating}
              className='rounded-lg bg-blue-500 px-6 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
            >
              {isCreating ? 'Creating...' : 'Create Blog'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
