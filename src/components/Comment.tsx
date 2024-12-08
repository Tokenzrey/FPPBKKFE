'use client';

import React, { useState } from 'react';

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
 * @param {Comment[]} props.initialComments - Daftar komentar awal (opsional).
 */
const CommentSection: React.FC<{ initialComments?: Comment[] }> = ({
  initialComments = [],
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments); // State untuk daftar komentar
  const [newComment, setNewComment] = useState<string>(''); // State untuk input komentar baru

  /**
   * Fungsi untuk menambahkan komentar baru.
   */
  const handleAddComment = () => {
    if (!newComment.trim()) {
      return; // Abaikan jika komentar kosong
    }

    const newCommentData: Comment = {
      id: comments.length + 1, // ID baru (sederhana, dapat diganti dengan ID dari server)
      name: 'Anonymous', // Nama pengguna default (dapat diganti dengan data pengguna)
      content: newComment.trim(),
      timestamp: new Date().toISOString(), // Timestamp saat ini
    };

    setComments([newCommentData, ...comments]); // Tambahkan komentar baru ke daftar
    setNewComment(''); // Reset input
  };

  /**
   * Fungsi untuk mengambil waktu dalam format yang lebih ramah pengguna.
   * @param {string} isoString - Timestamp dalam format ISO.
   * @returns {string} Waktu dalam format yang mudah dibaca.
   */
  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Format waktu lokal
  };

  return (
    <div className='mx-auto w-full max-w-2xl rounded-lg bg-gray-100 p-4 shadow-md'>
      <h3 className='mb-4 text-xl font-bold text-gray-700'>Komentar</h3>

      {/* Daftar Komentar */}
      <div className='mb-4 space-y-4'>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className='rounded-md border bg-white p-4 shadow-sm'
          >
            <p className='text-sm font-semibold text-gray-600'>
              {comment.name}
            </p>
            <p className='text-xs text-gray-500'>
              {formatTimestamp(comment.timestamp)}
            </p>
            <p className='mt-2 text-gray-700'>{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className='text-center text-gray-500'>Belum ada komentar.</p>
        )}
      </div>

      {/* Form Tambah Komentar */}
      <div className='flex items-center space-x-2'>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Tambahkan komentar...'
          className='flex-1 rounded-md border px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <button
          onClick={handleAddComment}
          className='rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
