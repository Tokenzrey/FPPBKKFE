import React from 'react';
import Like from '@/components/Like';
import CommentSection from '@/components/Comment';

type BlogData = {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  likes: {
    count: number;
    userLiked: boolean;
  };
  comments: {
    id: number;
    name: string;
    content: string;
    timestamp: string;
  }[];
};

/**
 * Komponen utama untuk menampilkan blog, komentar, dan fitur like.
 * @returns {JSX.Element} Elemen JSX untuk halaman blog.
 */
const Blog: React.FC = () => {
  // Inisialisasi data dummy blog
  const blog: BlogData = {
    id: 1,
    title: 'Membangun Aplikasi Web dengan React dan TypeScript',
    content:
      'React dan TypeScript memberikan kombinasi yang hebat untuk membangun aplikasi web modern. Artikel ini akan membahas bagaimana Anda dapat menggunakan kedua teknologi ini untuk membuat aplikasi yang scalable dan maintainable.',
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
    likes: {
      count: 42,
      userLiked: false,
    },
    comments: [
      {
        id: 1,
        name: 'John Smith',
        content: 'Artikel yang sangat membantu! Terima kasih.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Alice Johnson',
        content: 'Saya baru tahu tentang TypeScript, sangat menarik!',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return (
    <div className='mx-auto max-w-4xl space-y-6 rounded-lg bg-gray-100 p-6 shadow-md'>
      {/* Bagian Header Blog */}
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold text-gray-800'>{blog.title}</h1>
        <p className='text-sm text-gray-600'>
          Ditulis oleh{' '}
          <span className='font-semibold text-gray-800'>
            {blog.author.name}
          </span>{' '}
          (
          <a
            href={`mailto:${blog.author.email}`}
            className='text-blue-500 hover:underline'
          >
            {blog.author.email}
          </a>
          )
        </p>
      </div>

      {/* Isi Blog */}
      <div className='rounded-md bg-white p-4 text-lg leading-relaxed text-gray-700 shadow-sm'>
        <p>{blog.content}</p>
      </div>

      {/* Komponen Like */}
      <div className='flex justify-start'>
        <Like
          initialLiked={blog.likes.userLiked}
          initialCount={blog.likes.count}
        />
      </div>

      {/* Komponen Comment */}
      <div>
        <CommentSection initialComments={blog.comments} />
      </div>
    </div>
  );
};

export default Blog;
