import React, { useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Typography from '@/components/Typography';
import UnstyledLink from '@/components/links/UnstyledLink';
import { useBlogs } from '../hooks/mutation';

export function CarouselSize() {
  const [filter, setFilter] = useState('likes'); // Filter criteria

  // Fetch blogs with pagination
  const { data, isLoading, isError, isFetching, error } = useBlogs(
    1,
    15,
    filter, // Pass the current filter to useBlogs hook
  );

  const blogs = data?.blogs || []; // Safely access the blogs array

  // Handle loading state
  if (isLoading || isFetching) {
    return <p>Loading blogs...</p>;
  }

  // Handle error state
  if (isError) {
    return (
      <p className='text-red-500'>
        Failed to load blogs: {error?.message || 'Unknown error'}
      </p>
    );
  }

  // Render the carousel with fetched blogs
  return (
    <section className='relative flex w-full flex-col items-center gap-6 px-8 pb-12'>
      {/* Search and Filter Section */}
      <div className='mb-4 flex w-full items-center justify-between'>
        <label htmlFor='filter' className='mr-2 font-medium'>
          Sort by:
        </label>
        <select
          id='filter'
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Update filter state
          className='ml-2 rounded border p-2'
        >
          <option value=''>No Filter</option>
          <option value='likes'>Likes</option>
          <option value='comments'>Comments</option>
        </select>
      </div>

      {/* Carousel Section */}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className='w-full max-w-7xl'
      >
        <CarouselPrevious />
        <CarouselContent className='gap-0.5 md:gap-2'>
          {blogs.map((blog) => (
            <CarouselItem
              key={blog.ID}
              className='flex basis-full items-center justify-center md:basis-1/2 lg:basis-1/5'
            >
              <UnstyledLink
                href={`/blog/${blog.ID}`} // Blog detail link
                className='relative h-64 w-full overflow-hidden rounded-lg md:h-80 lg:h-96'
              >
                <img
                  className='absolute h-full w-full object-cover'
                  src={`http://localhost:4000/uploads/${blog.thumbnail}`} // Thumbnail URL
                  alt={`Thumbnail of ${blog.judul}`}
                />
                <div className='absolute bottom-0 w-full bg-black/50 p-4 text-center text-white'>
                  <Typography
                    variant='h4'
                    weight='bold'
                    className='text-typo-normal-white'
                  >
                    {blog.judul} {/* Blog title */}
                  </Typography>
                  <Typography variant='t2' className='text-typo-normal-white'>
                    {blog.User?.name || 'Unknown Author'} {/* Blog author */}
                  </Typography>
                </div>
              </UnstyledLink>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </section>
  );
}
