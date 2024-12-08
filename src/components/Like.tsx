import React, { useState } from 'react';

/**
 * Tipe data untuk properti komponen Like.
 * @typedef {Object} LikeProps
 * @property {boolean} initialLiked - Status awal apakah pengguna sudah menyukai (like) item.
 * @property {number} initialCount - Jumlah awal total like.
 */
type LikeProps = {
  initialLiked: boolean; // Apakah pengguna sudah like pada awalnya
  initialCount: number; // Jumlah awal like
};

/**
 * Komponen untuk tombol like/unlike.
 * @param {LikeProps} props - Properti yang diterima oleh komponen.
 * @returns {JSX.Element} Elemen JSX untuk tombol like/unlike dan jumlah like.
 */
const Like: React.FC<LikeProps> = ({ initialLiked, initialCount }) => {
  const [liked, setLiked] = useState<boolean>(initialLiked); // State untuk status like
  const [likeCount, setLikeCount] = useState<number>(initialCount); // State untuk jumlah like

  /**
   * Fungsi untuk menangani klik tombol like/unlike.
   */
  const handleLikeClick = () => {
    if (liked) {
      setLikeCount((prevCount) => prevCount - 1); // Kurangi jumlah like jika unlike
    } else {
      setLikeCount((prevCount) => prevCount + 1); // Tambahkan jumlah like jika like
    }
    setLiked((prevLiked) => !prevLiked); // Toggle status like
  };

  return (
    <div className='like-container'>
      {/* Tombol Like/Unlike */}
      <button
        onClick={handleLikeClick}
        className={`like-button ${liked ? 'liked' : ''}`}
      >
        {liked ? 'Unlike' : 'Like'}
      </button>

      {/* Jumlah Like */}
      <p className='like-count'>
        {likeCount} Like{likeCount !== 1 && 's'}
      </p>
    </div>
  );
};

export default Like;
