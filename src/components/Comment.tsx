'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

type Comment = {
  id: number;
  name: string;
  content: string;
  timestamp: string;
};

const CommentSection: React.FC<{ 
  blogId: string, 
  initialComments?: Comment[] 
}> = ({ blogId, initialComments = [] }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Untuk melacak fetch ulang
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data komentar
  const fetchComments = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await api.get(`/api/blogs/comment/${blogId}`);
      const fetchedComments = response.data.comments.map((comment: any) => ({
        id: comment.id,
        name: comment.user_name || 'Anonim', // Default ke "Anonim" jika nama kosong
        content: comment.comment,
        timestamp: comment.created_at,
      }));
      setComments(fetchedComments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to fetch comments');
    } finally {
      setIsFetching(false);
    }
  };

  // Ambil komentar saat komponen dimuat
  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/comment', {
        blog_id: Number(blogId),
        comment: newComment.trim(),
      });

      // Fetch ulang komentar setelah berhasil menambahkan
      await fetchComments();
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (isoString: string): string => {
    return new Date(isoString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h3 className="mb-4 text-xl font-bold text-gray-700">Komentar</h3>

      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}

      {/* Form Tambah Komentar */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tambahkan komentar..."
          disabled={isLoading}
          className="flex-1 rounded-md border px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddComment}
          disabled={isLoading || !newComment.trim()}
          className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        >
          {isLoading ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>

      {/* Daftar Komentar */}
      <div className="mb-4 space-y-4">
        {isFetching ? (
          <p className="text-center text-gray-500">Memuat komentar...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada komentar.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-md border bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-600">
                {comment.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(comment.timestamp)}
              </p>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
