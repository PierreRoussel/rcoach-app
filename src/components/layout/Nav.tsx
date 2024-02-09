'use client';
import { useIonRouter } from '@ionic/react';
import './Nav.scss';
import React from 'react';

export default function Nav() {
  const router = useIonRouter();
  return (
    <nav className='nav d-flex'>
      <button onClick={() => router.push('/','back')} className='btn icon reverse'>
        <i className='iconoir-nav-arrow-left'></i>
      </button>
    </nav>
  );
}
