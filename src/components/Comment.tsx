'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

/**
 * Tipe data untuk komentar.
 * @typedef {Object} Comment
 * @property {number} id - ID unik komentar.
 * @property {string} name - Nama pengguna yang memberikan komentar.
 * @property {string} content - Isi komentar.
 * @property {string} timestamp - Waktu komentar diberikan.
 */
type Comment = {
  id: number;
  name: string;
  content: string;
  timestamp: string;
};

/**
 * Komponen untuk menampilkan daftar komentar dan form untuk menambahkan komentar baru.
 * @param {Object} props - Properti yang diterima oleh komponen.
 * @param {number} props.blogId - ID blog.
 * @param {Comment[]} props.initialComments - Daftar komentar awal (opsional).
 */
const CommentSection: React.FC<{ 
  blogId: number, 
  initialComments?: Comment[] 
}> = ({ blogId, initialComments = [] }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/blogs/comment/${blogId}`);
        console.log(response.data.comments);
        const fetchedComments = response.data.comments.map((comment: any) => ({
          id: comment.id,
          name: comment.user_name || 'Anonim', // Default to "Anonim" if name is empty
          content: comment.comment,
          timestamp: comment.created_at,
        }));
        setComments(fetchedComments);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        setError('Failed to fetch comments');
      }
    };

    fetchComments();
  }, [blogId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/comment', {
        blog_id: blogId,
        comment: newComment.trim(),
      });

      // Add the new comment to the top of the list
      console.log(response.data);
      const newCommentData = {
        id: response.data.id,
        name: response.data.user_name || 'Anonim',
        content: response.data.comment,
        timestamp: response.data.created_at,
      };
      setComments([newCommentData, ...comments]);
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
    <div className='mx-auto w-full max-w-2xl rounded-lg bg-gray-100 p-4 shadow-md'>
      <h3 className='mb-4 text-xl font-bold text-gray-700'>Komentar</h3>

      {/* Error handling */}
      {error && (
        <div className='mb-4 text-red-500'>
          {error}
        </div>
      )}

      {/* Comment Input */}
      <div className='flex items-center space-x-2 mb-4'>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Tambahkan komentar...'
          disabled={isLoading}
          className='flex-1 rounded-md border px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <button
          onClick={handleAddComment}
          disabled={isLoading || !newComment.trim()}
          className='rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50'
        >
          {isLoading ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>

      {/* Comments List */}
      <div className='mb-4 space-y-4'>
        {comments.length === 0 ? (
          <p className='text-center text-gray-500'>Belum ada komentar.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className='rounded-md border bg-white p-4 shadow-sm'
            >
              <p className='text-sm font-semibold text-gray-600'>
                {comment.name}
              </p>
              <p className='text-xs text-gray-500'>
                {comment.timestamp}
              </p>
              <p className='mt-2 text-gray-700'>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
