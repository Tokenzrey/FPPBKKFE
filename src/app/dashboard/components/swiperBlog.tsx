import React from 'react';

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
  // Fetch blogs with pagination
  const { data, isLoading, isError, isFetching, error } = useBlogs(
    1,
    15,
    'comments',
  ); // Fetch the first page with 15 blogs

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
              href={`/blogs/${blog.ID}`} // Blog detail link
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
  );
}
