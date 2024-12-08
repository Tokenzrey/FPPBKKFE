'use client'
import React from 'react';
import Like from '@/components/Like';

const LikePage: React.FC = () => {
  return (
    <div>
      <h2>Like Page</h2>
      <p>Berikan tanda suka untuk artikel ini:</p>

      {/* Komponen Like */}
      <Like blogId={10} />
    </div>
  );
};

export default LikePage;
