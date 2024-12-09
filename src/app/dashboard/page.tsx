'use client';
import React, { useState, useMemo, useEffect } from 'react';
import NextImage from '@/components/NextImage';
import withAuth from '@/lib/Auth/withAuth';
import Sidebar from '@/components/sidebar';
import { CarouselSize } from './components/swiperBlog';
import { ListBlog } from './components/listBlog';

export default withAuth(Dashboardage, 'auth');

function Dashboardage() {
  return (
    <Sidebar>
      <main className='flex w-full flex-col items-center justify-center gap-20'>
        <CarouselSize />
        <ListBlog />
      </main>
    </Sidebar>
  );
}
