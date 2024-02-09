'use client';
import './Nav.scss';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav className='nav d-flex'>
      {pathname !== '/' && (
        <button onClick={() => router.back()} className='btn icon reverse'>
          <i className='iconoir-nav-arrow-left'></i>
        </button>
      )}
    </nav>
  );
}
