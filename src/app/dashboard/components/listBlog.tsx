import React, { useState } from 'react';
import { useSearchBlogs } from '../hooks/mutation';
import Button from '@/components/buttons/Button';
import UnstyledLink from '@/components/links/UnstyledLink';

/**
 * ListBlog Component: Displays a paginated list of blogs with search and filter functionality.
 */
export function ListBlog() {
  const [page, setPage] = useState(1); // Current page state
  const perPage = 10; // Items per page
  const [search, setSearch] = useState(''); // Search query
  const [filter, setFilter] = useState('all'); // Filter criteria

  const { data, isLoading, isError, error, isFetching } = useSearchBlogs(
    page,
    perPage,
    search,
    filter,
  );

  // Handle Loading State
  if (isLoading) {
    return <p>Loading blogs...</p>;
  }

  // Handle Error State
  if (isError) {
    return (
      <p className='text-red-500'>
        Failed to load blogs: {error?.message || 'Unknown error'}
      </p>
    );
  }

  const blogs = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const lastPage = Math.ceil(total / perPage);

  return (
    <section className='relative w-full px-8 pb-12'>
      {/* Search and Filter Section */}
      <div className='mb-4 flex items-center justify-between'>
        <input
          type='text'
          placeholder='Search blogs...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full rounded border p-2 md:w-1/2'
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='ml-2 rounded border p-2'
        >
          <option value='all'>All</option>
          <option value='username'>Username</option>
          <option value='judul'>Title</option>
          <option value='content'>Content</option>
        </select>
      </div>

      {/* Blog List */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {blogs.map((blog) => (
          <UnstyledLink
            key={blog.ID}
            className='rounded-lg border bg-white p-4 shadow-md hover:shadow-lg'
            href={`/blog/${blog.ID}`}
          >
            <img
              src={`http://localhost:4000/uploads/${blog.thumbnail}`}
              alt={blog.judul}
              className='mb-2 h-40 w-full rounded-lg object-cover'
            />
            <h3 className='text-lg font-bold'>{blog.judul}</h3>
            <p className='text-gray-500'>{blog.content.substring(0, 100)}...</p>
            <p className='mt-1 text-sm text-gray-400'>
              By: {blog.User.name || 'Unknown'}
            </p>
          </UnstyledLink>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className='mt-4 flex items-center justify-between'>
        <Button
          variant='info'
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {page} of {lastPage}
        </span>
        <Button
          variant='info'
          disabled={page === lastPage}
          onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
        >
          Next
        </Button>
      </div>

      {isFetching && (
        <p className='mt-2 text-gray-500'>Loading more blogs...</p>
      )}
    </section>
  );
}
