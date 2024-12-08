import React, { useState, useEffect } from 'react';

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
    <div className='comment-section'>
      <h3 className='comment-title'>Komentar</h3>

      {/* Daftar Komentar */}
      <div className='comment-list'>
        {comments.map((comment) => (
          <div key={comment.id} className='comment'>
            <p className='comment-name'>{comment.name}</p>
            <p className='comment-timestamp'>
              {formatTimestamp(comment.timestamp)}
            </p>
            <p className='comment-content'>{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className='no-comments'>Belum ada komentar.</p>
        )}
      </div>

      {/* Form Tambah Komentar */}
      <div className='add-comment'>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Tambahkan komentar...'
          className='comment-input'
        />
        <button onClick={handleAddComment} className='submit-button'>
          Kirim
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
