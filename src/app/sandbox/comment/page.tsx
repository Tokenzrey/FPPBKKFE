import React from 'react';
import CommentSection from '@/components/Comment';

const CommentPage: React.FC = () => {
  return (
    <div>
      <h2>Comment Page</h2>
      <p>Tambahkan komentar Anda di bawah ini:</p>

      {/* Komponen Comment */}
      <CommentSection
        initialComments={[
          {
            id: 1,
            name: 'User1',
            content: 'Ini adalah komentar pertama!',
            timestamp: new Date().toISOString(),
          },
        ]}
      />
    </div>
  );
};

export default CommentPage;
