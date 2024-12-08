'use client'
import React from 'react';
import CommentSection from '@/components/Comment';

export default function CommentSandbox (){
  return (
    <div>
      <h2>Comment Page</h2>
      <p>Tambahkan komentar Anda di bawah ini:</p>

      {/* Komponen Comment */}
      <CommentSection
        blogId={10}
        initialComments={[]}
      />
    </div>
  );
};
