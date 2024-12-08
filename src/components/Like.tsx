import React, { useState, useEffect } from 'react';
import IconButton from './buttons/IconButton';
import { ThumbsUp, Heart } from 'lucide-react';
import { cn } from '@/lib/cn';import api from '@/lib/api';

/**
 * Tipe data untuk properti komponen Like.
 * @typedef {Object} LikeProps
 * @property {number} blogId - ID blog yang akan dilike
 */
type LikeProps = {
  blogId: string;
};

/**
 * Komponen untuk tombol like/unlike dengan integrasi API.
 * @param {LikeProps} props - Properti yang diterima oleh komponen.
 * @returns {JSX.Element} Elemen JSX untuk tombol like/unlike dan jumlah like.
 */
const Like: React.FC<LikeProps> = ({ blogId }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial like status and count when component mounts
  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const response = await api.get(`/api/blogs/like/${blogId}`, {
        });
        console.log(response.data);

        setLiked(response.data.liked_by_user);
        setLikeCount(response.data.likes_count);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching like information:', error);
        setLoading(false);
      }
    };

    fetchLikeInfo();
  }, [blogId]);

  /**
   * Fungsi untuk menangani klik tombol like/unlike.
   */
  const handleLikeClick = async () => {
    try {
      const response = await api.post('/like', 
        { blog_id: Number(blogId) }
      );

      // Update state based on the server response
      setLiked(response.data.liked);
      
      // Adjust like count based on like/unlike action
      if (response.data.liked) {
        setLikeCount(prevCount => prevCount + 1);
      } else {
        setLikeCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error('Error processing like/unlike:', error);
      // Optionally, you could show an error message to the user
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex items-center space-x-4'>
      {/* Tombol Like/Unlike */}
      <IconButton
        onClick={handleLikeClick}
        Icon={liked ? Heart : ThumbsUp}
        className={cn(liked && '!bg-success-normal')}
      />

      {/* Jumlah Like */}
      <p className='text-sm font-medium text-gray-700'>
        {likeCount} Like{likeCount !== 1 && 's'}
      </p>
    </div>
  );
};

export default Like;