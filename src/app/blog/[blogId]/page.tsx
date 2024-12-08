'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Like from '@/components/Like';
import CommentSection from '@/components/Comment';

type BlogData = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
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
  const { blogId } = useParams<{ blogId: string }>(); // Ambil blogId dari URL

  const { data: blog, isLoading, isError, error } = useQuery<BlogData, Error>({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!blogId) throw new Error('Blog ID is missing');
      const response = await api.get(`/api/blog/${blogId}`);
      return response.data.data;
    },
    enabled: !!blogId, // Hanya jalankan jika blogId tersedia
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p className="text-red-500">{error.message}</p>;
  }
  // Log the fetched blog data
  if (blog) {
    console.log(blog);
  }
  
  if (!blog) {
    return <p>Blog not found</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-lg p-6 shadow-md">
      {/* Bagian Header Blog */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">{blog.title}</h1>
        <p className="text-sm text-gray-600">
          Ditulis oleh{' '}
          <span className="font-semibold text-gray-800">{blog.author.name}</span>
          (
          <a
            href={`mailto:${blog.author.email}`}
            className="text-blue-500 hover:underline"
          >
            {blog.author.email}
          </a>
          )
        </p>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* Isi Blog */}
      <div className="flex justify-center">
        <img
          src={`http://localhost:4000/uploads/${blog.thumbnail}`} // Use the dynamic thumbnail path
          alt="Blog Thumbnail"
          className="rounded-md"
        />
      </div>

      <div className="rounded-md bg-white p-4 text-lg text-justify leading-relaxed text-gray-700 shadow-sm">
        <p>{blog.content}</p>
      </div>

      {/* Komponen Like */}
      <div className="flex justify-start">
        <Like blogId={blogId} />
      </div>

      {/* Komponen Comment */}
      <div>
        <CommentSection blogId={blogId} />
      </div>
    </div>
  );
};

export default Blog;
