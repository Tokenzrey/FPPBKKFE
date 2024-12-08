'use client';
import React, { useState, useMemo, useEffect } from 'react';
import NextImage from '@/components/NextImage';
import withAuth from '@/lib/Auth/withAuth';
import Sidebar from '@/components/sidebar';


export default withAuth(Dashboardage, 'auth');

function Dashboardage() {
  return (
    <Sidebar>
      <main className='p-5'> </main>
    </Sidebar>
  );
}
