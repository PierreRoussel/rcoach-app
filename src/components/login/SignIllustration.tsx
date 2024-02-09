import React from 'react';
import './Login.scss';

export default function SignIllustration(params: { children: any }) {
  return (
    <div className='sign-illustration'>
      <h1>RCOACH</h1>
      {params.children}
    </div>
  );
}
